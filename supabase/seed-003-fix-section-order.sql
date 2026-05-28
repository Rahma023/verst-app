-- ============================================================
-- Fix: Carbon Markets → Section A (order 1-5);
--      AI in Climate → Section B (order 6-9).
--
-- The previous seed run kept the OLD ordering for some reason.
-- This targeted UPDATE swaps section + order_index without
-- touching the rest of each module's columns.
-- Safe to re-run.
-- ============================================================

update public.modules set section = 'A', order_index = 1 where id = 'm1';
update public.modules set section = 'A', order_index = 2 where id = 'm2';
update public.modules set section = 'A', order_index = 3 where id = 'm3';
update public.modules set section = 'A', order_index = 4 where id = 'm4';
update public.modules set section = 'A', order_index = 5 where id = 'm5';
update public.modules set section = 'B', order_index = 6 where id = 'a1';
update public.modules set section = 'B', order_index = 7 where id = 'a2';
update public.modules set section = 'B', order_index = 8 where id = 'a3';
update public.modules set section = 'B', order_index = 9 where id = 'a4';

-- Verify — Carbon (I-V) should appear first.
select id, code, section, order_index, title
from   public.modules
order  by order_index;
