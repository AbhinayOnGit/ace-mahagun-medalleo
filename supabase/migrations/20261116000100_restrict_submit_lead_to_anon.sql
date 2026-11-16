-- Only the server route (anon / publishable key) needs submit_lead; signed-in users do not.
revoke execute on function public.submit_lead(text,text,text,text,text,text,text,text,text,text,text,boolean,text,uuid,boolean) from authenticated;
