insert into rating(rating_point)
values (1),(1.5),(2),(2.5),(3),(3.5),(4),(4.5),(5);

insert into category(id, name, description)
values ('18174493-12db-4120-b685-f68a1a1f7a8d','Example category''s name','Example category''s description');

insert into product(id, stock, total_review, name, img_url, base_price, discount_percentage, description)
values ('32c755a0-7428-455e-a6d3-66689b48c8e9',30, 1,'Example 1','example url',200,0,'example description'),
       ('996332db-281d-41dc-aa65-c7c19b70a9f3',30, 1,'Example 2','example url',200,0,'example description');

insert into category_product(id, category_id, product_id)
values ('2bfa19ac-8685-4f03-905a-fec2543c2848','18174493-12db-4120-b685-f68a1a1f7a8d','32c755a0-7428-455e-a6d3-66689b48c8e9'),
        ('5cb89bfd-7e03-4062-8251-4f60576b3603','18174493-12db-4120-b685-f68a1a1f7a8d','996332db-281d-41dc-aa65-c7c19b70a9f3');
