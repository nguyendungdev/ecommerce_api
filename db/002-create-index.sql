create index idx_us
on users(id);

create index idx_order_id
on "order"(id);

create index idx_order_user_id
on "order"(user_id);