-- =========================================================
-- Trox Box AI Support Chatbot - Supabase Initialization Schema
-- =========================================================

-- Enable the pgvector extension for AI semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. PROFILES Table (Admin Roles)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CHATBOT SETTINGS Table (Singleton config row)
CREATE TABLE IF NOT EXISTS chatbot_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'Trox Box',
    bot_name TEXT NOT NULL DEFAULT 'TroxBot',
    welcome_message TEXT NOT NULL DEFAULT 'Hi! 👋 Welcome to Trox Box. How can I help you with your clothing order today?',
    fallback_message TEXT NOT NULL DEFAULT 'I don’t have enough information about that in my knowledge base. Please reach out to our human support team at support@troxbox.com and we will be happy to help!',
    allowed_topics TEXT[] NOT NULL DEFAULT ARRAY['Orders', 'Parcel Tracking', 'Returns/Refunds', 'Product Information', 'Shipping', 'Payment', 'Business Timings', 'Contact Support'],
    primary_color TEXT NOT NULL DEFAULT '#6366F1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. FAQS Table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. KNOWLEDGE BASE Table (With 768-dim Vector Embeddings for Google Gemini)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    embedding VECTOR(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DEMO ORDERS Table
CREATE TABLE IF NOT EXISTS demo_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'
    tracking_id TEXT,
    courier TEXT,
    estimated_delivery TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CONVERSATIONS Table (Stores logged interactions)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'web_widget',
    is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- Cosine Similarity Vector Match Function (RAG Search RPC)
-- =========================================================
CREATE OR REPLACE FUNCTION match_knowledge_base (
    query_embedding VECTOR(768),
    match_threshold FLOAT,
    match_count INT
) RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    category TEXT,
    similarity FLOAT
) LANGUAGE sql STABLE AS $$
    SELECT
        id,
        title,
        content,
        category,
        1 - (embedding <=> query_embedding) AS similarity
    FROM knowledge_base
    WHERE is_active = true 
      AND embedding IS NOT NULL
      AND 1 - (embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
$$;

-- =========================================================
-- Enable Row Level Security (RLS) on all tables
-- =========================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- RLS Policies
-- =========================================================

-- Profiles Policies
CREATE POLICY "Admins can read own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can update own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

-- Chatbot Settings Policies
CREATE POLICY "Anyone can read chatbot settings" ON chatbot_settings 
    FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage chatbot settings" ON chatbot_settings 
    FOR ALL USING (auth.role() = 'authenticated');

-- FAQs Policies
CREATE POLICY "Anyone can read active FAQs" ON faqs 
    FOR SELECT USING (is_active = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Admins can manage FAQs" ON faqs 
    FOR ALL USING (auth.role() = 'authenticated');

-- Knowledge Base Policies
CREATE POLICY "Admins can manage knowledge base" ON knowledge_base 
    FOR ALL USING (auth.role() = 'authenticated');
-- Note: Public users have NO access to read raw knowledge base directly. RAG server API queries it using service_role bypass.

-- Demo Orders Policies
CREATE POLICY "Anyone can look up order status" ON demo_orders 
    FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage demo orders" ON demo_orders 
    FOR ALL USING (auth.role() = 'authenticated');

-- Conversations Policies
CREATE POLICY "Anyone can create conversation logs" ON conversations 
    FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can read all conversation logs" ON conversations 
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete conversation logs" ON conversations 
    FOR DELETE USING (auth.role() = 'authenticated');

-- =========================================================
-- Seed Data Insertion
-- =========================================================

-- Default Chatbot Settings Row
INSERT INTO chatbot_settings (business_name, bot_name, welcome_message, fallback_message, primary_color)
VALUES (
    'Trox Box', 
    'TroxBot', 
    'Hi! 👋 Welcome to Trox Box. How can I help you with your clothing order today?', 
    'I don’t have enough information about that in my knowledge base. Please reach out to our support team at support@troxbox.com, and we will be happy to help!', 
    '#6366F1'
) ON CONFLICT DO NOTHING;

-- FAQs Seed Data (5 rows)
INSERT INTO faqs (question, answer, category, is_active) VALUES
(
    'What is your return policy?', 
    'We offer a 30-day hassle-free return policy for all unworn clothing in its original packaging with tags attached. Return shipping is free inside the US. Refunds are credited back to your original payment method within 5-7 business days of receipt.', 
    'Returns', 
    TRUE
),
(
    'How long does shipping take?', 
    'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International shipping takes 7-14 business days depending on customs and location. Orders are processed within 24 hours of placing them.', 
    'Shipping', 
    TRUE
),
(
    'Do you offer free shipping?', 
    'Yes, we offer free standard shipping on all orders over $75 within the United States. For orders under $75, standard shipping is a flat rate of $5.99.', 
    'Shipping', 
    TRUE
),
(
    'What payment methods do you accept?', 
    'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. We also support interest-free installment payments through Klarna and Afterpay.', 
    'Billing', 
    TRUE
),
(
    'How do I contact customer support?', 
    'You can reach our human support team via email at support@troxbox.com, or by calling our hotline at 1-800-555-TROX (Mon-Fri 9 AM - 6 PM EST). We aim to respond to all emails within 4 hours.', 
    'Support', 
    TRUE
) ON CONFLICT DO NOTHING;

-- Demo Orders Seed Data (5 rows TRX-1001 to TRX-1005)
INSERT INTO demo_orders (order_number, customer_name, status, tracking_id, courier, estimated_delivery, notes) VALUES
(
    'TRX-1001', 
    'John Doe', 
    'Delivered', 
    '1Z999AA10123456784', 
    'UPS', 
    'Delivered on May 15, 2026', 
    'Package left at front door.'
),
(
    'TRX-1002', 
    'Jane Smith', 
    'Shipped', 
    '9400100000000000000022', 
    'USPS', 
    'May 24, 2026', 
    'Currently in transit at regional distribution center.'
),
(
    'TRX-1003', 
    'Michael Johnson', 
    'Processing', 
    NULL, 
    NULL, 
    'May 27, 2026', 
    'Items are being packaged in the warehouse.'
),
(
    'TRX-1004', 
    'Emily Davis', 
    'Out for Delivery', 
    '1Z888BB20234567891', 
    'UPS', 
    'Today by 7:00 PM', 
    'Courier has loaded the package onto delivery truck.'
),
(
    'TRX-1005', 
    'David Wilson', 
    'Cancelled', 
    NULL, 
    NULL, 
    NULL, 
    'Cancelled by customer request prior to shipment.'
) ON CONFLICT DO NOTHING;

-- Knowledge Base Seed Data (Default policies and sizing guides for RAG fallback)
INSERT INTO knowledge_base (title, content, category, is_active) VALUES
(
    'Sizing Guide and Fit Instructions', 
    'At Trox Box, our clothing generally runs true to size. For our classic tees and hoodies, we offer an oversized fit. We recommend choosing your standard size for a relaxed look, or sizing down if you prefer a slim fit. For jeans, we use premium stretch denim. Always check our specific item size charts available on the product detail pages for precise measurements.', 
    'Product Info', 
    TRUE
),
(
    'International Custom Duties and Taxes', 
    'Trox Box ships globally. Please note that international shipments may be subject to import duties, taxes, and custom fees levied by the destination country. These fees are the responsibility of the recipient. Customs policies vary widely, so please consult your local customs office for specific details.', 
    'Shipping', 
    TRUE
),
(
    'Clothing Care and Washing Instructions', 
    'To preserve the premium quality, color, and fit of your Trox Box items, we recommend washing clothes in cold water (30°C) with similar colors. Turn screen-printed tees and hoodies inside out before washing. Lay flat to dry or tumble dry on low heat. Never iron directly on printed designs.', 
    'Product Info', 
    TRUE
);
