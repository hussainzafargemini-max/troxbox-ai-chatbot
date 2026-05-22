\# Trox Box AI Support Chatbot - Walkthrough



\## Project Overview

Trox Box AI Support Chatbot is a website-specific AI support chatbot for an e-commerce clothing brand. It answers customer questions using business data stored in Supabase and includes an admin dashboard for managing FAQs, knowledge base articles, chatbot settings, sample orders, and conversation logs.



\## Tech Stack

\- Next.js

\- TypeScript

\- Tailwind CSS

\- Supabase

\- Supabase Auth

\- Google Gemini API

\- RAG-based knowledge retrieval



\## Main Features

1\. Public storefront landing page

2\. Floating AI chatbot widget

3\. Admin login system

4\. Admin dashboard

5\. FAQ manager

6\. Knowledge base manager

7\. Chatbot settings manager

8\. Sample order tracking

9\. Conversation logs

10\. Secure server-side API routes



\## Database

The project uses Supabase for:

\- Admin authentication

\- FAQ storage

\- Knowledge base storage

\- Chatbot settings

\- Sample order tracking

\- Conversation history logs



\## AI Chatbot Logic

The chatbot:

\- Accepts customer questions

\- Checks if the question is related to Trox Box support

\- Retrieves relevant FAQ or knowledge base content

\- Checks order status if an order ID is provided

\- Uses Gemini API to generate a controlled response

\- Refuses unrelated questions

\- Saves chat logs in the database



\## Admin Panel

The admin panel allows the owner to:

\- View dashboard metrics

\- Add/edit/delete FAQs

\- Add/edit/delete knowledge base articles

\- Manage chatbot settings

\- View conversation logs

\- Manage sample orders

\- Test chatbot responses



\## Security

\- Admin routes are protected

\- API keys are stored in .env.local only

\- .env.local is not included in submission

\- .env.example is included for setup guidance

\- Supabase Row Level Security is enabled



\## Testing Performed

\- Homepage opened successfully

\- Admin login worked

\- FAQ added successfully

\- Knowledge base available

\- Chatbot answered business questions

\- Order tracking returned order status

\- Unrelated questions were refused

\- Conversation logs saved successfully

\- npm run build completed successfully



\## Run Instructions

1\. Install dependencies:

npm install



2\. Add environment variables using .env.example



3\. Start development server:

npm run dev



4\. Open:

http://localhost:3000



5\. Admin:

http://localhost:3000/admin/login



\## Build Test

The project was tested with:

npm run build



The build completed successfully.

