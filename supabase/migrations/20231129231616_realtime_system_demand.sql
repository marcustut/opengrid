create table "public"."realtime_system_demand" (
    "event_time" timestamp with time zone not null,
    "value" double precision not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."realtime_system_demand" enable row level security;

CREATE UNIQUE INDEX realtime_system_demand_pkey ON public.realtime_system_demand USING btree (event_time);

alter table "public"."realtime_system_demand" add constraint "realtime_system_demand_pkey" PRIMARY KEY using index "realtime_system_demand_pkey";



