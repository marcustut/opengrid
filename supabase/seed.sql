insert into "public"."alert_type" (name, description, default_threshold, default_comparator)
values ('actual_demand', 'The actual system demand which represents the electricity production required to meet national consumption.', 4000, 'lte'),
       ('forecast_demand', 'The forecasted system demand which represents the electricity production required to meet national consumption.', 4000, 'lte');