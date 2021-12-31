it is not possible to have an empty `type Query {}` or `type Mutation {}`. therefore, the project-belonging queries and
mutations have been placed into the root file. if the project will have any "domain-neutral" queries or mutations at any
time they shall be placed into the root files and the project scoped ones shall be moved into `project.graphqls`.
