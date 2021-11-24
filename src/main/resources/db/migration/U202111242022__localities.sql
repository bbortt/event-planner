DROP TABLE locality;

DELETE
FROM member_permission
WHERE permission_id IN ('locality:create',
                        'locality:list',
                        'locality:edit',
                        'locality:move',
                        'locality:delete');
DELETE
FROM permission
WHERE id IN ('locality:create',
             'locality:list',
             'locality:edit',
             'locality:move',
             'locality:delete');
