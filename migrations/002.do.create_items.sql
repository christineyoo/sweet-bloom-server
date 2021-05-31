create table items (
    id integer primary key generated by default as identity,
    item_name text not null,
    item_price integer not null,
    item_description text not null
);

alter table items
    add column
        group_id integer references groups(id) on delete cascade not null;