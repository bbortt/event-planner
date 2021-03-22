select invitation0_.id                 as id1_1_,
       invitation0_.created_by         as created_2_1_,
       invitation0_.created_date       as created_3_1_,
       invitation0_.last_modified_by   as last_mod4_1_,
       invitation0_.last_modified_date as last_mod5_1_,
       invitation0_.accepted           as accepted6_1_,
       invitation0_.color              as color7_1_,
       invitation0_.email              as email8_1_,
       invitation0_.project_id         as project10_1_,
       invitation0_.responsibility_id  as respons11_1_,
       invitation0_.role_name          as role_na12_1_,
       invitation0_.token              as token9_1_,
       invitation0_.jhi_user_id        as jhi_use13_1_
from invitation invitation0_
where invitation0_.accepted = false
  and (invitation0_.token is not null)
  and invitation0_.created_date<?
