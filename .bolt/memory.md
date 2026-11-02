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
- Product options simplified per product; only relevant customization choices shown

## Decisions, constraints & rationale

- UF company = VAT-exempt (momsbefriade); all prices shown include moms and frakt
- Prices labeled as "Preliminärt exempelpris, inte en offert" to manage expectations
- No direct payment/checkout; contact-based ordering flow
- Cart content shared with contact form so both company and customer see the same inquiry context
- Vattenflaska options: bottle color selection restored with 8 colors (Vit, Ljusblå, Ljusgrön, Rosa, Röd, Blå, Orange, Transparent); images derived from existing bottle image
- Vattenflaska print options remain under "Antal färger i din design"; "tryckalternativ" (lasergravyr, fullfärg, otryckt) kept
- Earlier decision to remove bottle color and print area was reversed per user request

## Open questions & assumptions

- Assuming cart data is passed via state/props to contact page (mechanism TBD per stack)
- Exact product types/categories not fully specified
- Unknown: whether example images are sent manually or via an automated gallery
- May need similar option simplification/restoration for other products
- Print area option still removed; unclear if it should be restored too