create type "public"."region" as enum ('ROI', 'NI', 'ALL');

alter table "public"."alert" add column "region" region not null default 'ROI'::region;



