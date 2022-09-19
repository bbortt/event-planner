# PostgreSQL

The following lines will get you started (execute them from within the `project.rootDirectory`):

```shell
pod_id=$(
  [docker/podman] run \
      -p 5432:5432 -d \
      --name event_planner.projects_service \
      -e POSTGRES_DB=event_planner \
      -e POSTGRES_USER=event_planner \
      -e POSTGRES_PASSWORD=event_planner_password \
      postgres:14.1-alpine
)
cat apps/projects-service/src/test/resources/db/scripts/init-projects_service.sql | \
  docker exec -i $pod_id psql -U event_planner -f - event_planner
./gradlew :apps:projects-service:flywayMigrateDev
```
