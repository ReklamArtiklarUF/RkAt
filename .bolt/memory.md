# Project memory

## Product intent & audience

- UF (Ung Företagsamhet) student company webshop
- Audience: customers interested in custom/personalized products
- Sales model: inquiry-based (contact for ordering), not direct checkout
- Products are custom-made; company can send example images showing how a product can look

## Brand personality & voice

- Swedish-language UI
- Transparent, informal, student-business tone
- Clear about limitations (not a formal quote, preliminary pricing)

## Visual design & UX direction

- Cart page includes bold informational text about preliminary pricing and example images
- Contact page dynamically displays cart contents (products, quantities, total) when items exist
- "Kontakta oss om beställningen" button/flow carries cart context into contact form

## Decisions, constraints & rationale

- UF company = VAT-exempt (momsbefriade); all prices shown include moms and frakt
- Prices labeled as "Preliminärt exempelpris, inte en offert" to manage expectations
- No direct payment/checkout; contact-based ordering flow
- Cart content shared with contact form so both company and customer see the same inquiry context

## Open questions & assumptions

- Assuming cart data is passed via state/props to contact page (mechanism TBD per stack)
- Exact product types/categories not yet specified
- Unknown: whether example images are sent manually or via an automated gallery