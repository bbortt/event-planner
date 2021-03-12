package io.github.bbortt.event.planner;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("io.github.bbortt.event.planner");

        noClasses()
            .that()
                .resideInAnyPackage("io.github.bbortt.event.planner.service..")
            .or()
                .resideInAnyPackage("io.github.bbortt.event.planner.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..io.github.bbortt.event.planner.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
