create index idx_us
on "user"(id);

create index idx_order_id
on "order"(id);

create index idx_order_user_id
on "order"(user_id);

create index idx_oder_item_id
on "order_item"(id);

create index idx_review_id
on "review"(id);

create index idx_category_id
on "category"(id);

create index idx_product_name
on "product"(name);

create index idx_product_id
on "product"(id);

create index idx_category_product_id
on "category_product"(id);

create index idx_payment_id
on "payment"(id);

create index idx_rating_id
on "rating"(id);

create index idx_invoice_id
on "invoice"(id);
















