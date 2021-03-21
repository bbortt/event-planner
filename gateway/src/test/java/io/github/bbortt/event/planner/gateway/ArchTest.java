package io.github.bbortt.event.planner.gateway;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("io.github.bbortt.event.planner.gateway");

        noClasses()
            .that()
            .resideInAnyPackage("io.github.bbortt.event.planner.gateway.service..")
            .or()
            .resideInAnyPackage("io.github.bbortt.event.planner.gateway.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..io.github.bbortt.event.planner.gateway.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
