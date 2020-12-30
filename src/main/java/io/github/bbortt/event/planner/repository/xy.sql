select *
from section s
         left join section_has_events se on s.id = se.section_id
         left join event e on se.event_id = e.id
where s.location_id = ?
order by s.name;

select location0_.id                as id1_7_0_,
       location0_.name              as name2_7_0_,
       location0_.project_id        as project_3_7_0_,
       location0_.responsibility_id as responsi4_7_0_,
       project1_.id                 as id1_9_1_,
       project1_.description        as descript2_9_1_,
       project1_.end_time           as end_time3_9_1_,
       project1_.name               as name4_9_1_,
       project1_.start_time         as start_ti5_9_1_,
       responsibi2_.id              as id1_10_2_,
       responsibi2_.name            as name2_10_2_,
       responsibi2_.project_id      as project_3_10_2_,
       project3_.id                 as id1_9_3_,
       project3_.description        as descript2_9_3_,
       project3_.end_time           as end_time3_9_3_,
       project3_.name               as name4_9_3_,
       project3_.start_time         as start_ti5_9_3_
from location location0_
         inner join project project1_ on location0_.project_id = project1_.id
         left outer join responsibility responsibi2_
                         on location0_.responsibility_id = responsibi2_.id
         left outer join project project3_ on responsibi2_.project_id = project3_.id
where location0_.id=?;
