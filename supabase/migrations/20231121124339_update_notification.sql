create type "public"."email_notification_status" as enum ('pending', 'success', 'error');

create type "public"."notification_level" as enum ('info', 'warn', 'error');

drop policy "Enable read access for all users" on "public"."user_notification";

drop policy "Enable update for users based on user_id" on "public"."user_notification";

alter table "public"."user_notification" drop constraint "user_notification_user_id_fkey";

alter table "public"."user_notification" drop constraint "notification_pkey";

drop index if exists "public"."notification_pkey";

drop table "public"."user_notification";

create table "public"."email_notification" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "from" text not null,
    "to" text not null,
    "subject" text not null,
    "html" text not null,
    "user_id" uuid,
    "status" email_notification_status not null default 'pending'::email_notification_status
);


alter table "public"."email_notification" enable row level security;

create table "public"."in_app_notification" (
    "id" uuid not null default gen_random_uuid(),
    "description" text not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "read" boolean not null default false,
    "title" text not null,
    "level" notification_level not null default 'info'::notification_level
);


alter table "public"."in_app_notification" enable row level security;

CREATE UNIQUE INDEX email_notification_pkey ON public.email_notification USING btree (id);

CREATE UNIQUE INDEX notification_pkey ON public.in_app_notification USING btree (id);

alter table "public"."email_notification" add constraint "email_notification_pkey" PRIMARY KEY using index "email_notification_pkey";

alter table "public"."in_app_notification" add constraint "notification_pkey" PRIMARY KEY using index "notification_pkey";

alter table "public"."email_notification" add constraint "email_notification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."email_notification" validate constraint "email_notification_user_id_fkey";

alter table "public"."in_app_notification" add constraint "in_app_notification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."in_app_notification" validate constraint "in_app_notification_user_id_fkey";

create policy "Enable read access for all users"
on "public"."in_app_notification"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Enable update for users based on user_id"
on "public"."in_app_notification"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));




