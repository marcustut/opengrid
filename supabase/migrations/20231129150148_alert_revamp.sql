alter table "public"."alert" drop column "comparator";

alter table "public"."alert" drop column "description";

alter table "public"."alert" drop column "name";

alter table "public"."alert" drop column "threshold";

alter table "public"."alert" add column "phone_numbers" text[] not null default ARRAY[]::text[];

alter table "public"."alert" add column "send_email" boolean not null default true;

alter table "public"."alert" alter column "region" set default 'ALL'::region;

alter table "public"."alert" add unique (user_id, alert_type);

alter table "public"."alert_type" drop column "default_comparator";

alter table "public"."alert_type" drop column "default_threshold";

create or replace function "auth"."create_default_alerts"()
    returns trigger 
    language plpgsql
    security definer
    as
$$
declare
    at record;
begin
    for at in select name from "public"."alert_type"
    loop 
        insert into "public"."alert" (alert_type, user_id, active) values (at.name, NEW.id, false) on conflict do nothing;
    end loop;

    return new;
end;
$$;

create or replace trigger "create_default_alerts_for_new_user"
before update
on "auth"."users"
for each row
execute procedure "auth"."create_default_alerts"();