drop policy "Enable delete for users based on user_id" on "public"."alert";

drop policy "Enable insert for users based on user_id" on "public"."alert";

create policy "Enable update for users based on user_id"
on "public"."alert"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));




