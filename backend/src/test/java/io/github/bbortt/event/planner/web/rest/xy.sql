select distinct section0_.id                as id1_12_0_,
                events1_.id                 as id1_0_1_,
                section0_.location_id       as location3_12_0_,
                section0_.name              as name2_12_0_,
                section0_.responsibility_id as responsi4_12_0_,
                section0_.jhi_user_id       as jhi_user5_12_0_,
                events1_.description        as descript2_0_1_,
                events1_.end_time           as end_time3_0_1_,
                events1_.name               as name4_0_1_,
                events1_.responsibility_id  as responsi6_0_1_,
                events1_.section_id         as section_7_0_1_,
                events1_.start_time         as start_ti5_0_1_,
                events1_.jhi_user_id        as jhi_user8_0_1_,
                events1_.section_id         as section_7_0_0__,
                events1_.id                 as id1_0_0__
from section section0_
         left outer join event events1_ on section0_.id = events1_.section_id
where section0_.location_id=?
order by section0_.name
