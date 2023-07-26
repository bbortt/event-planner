package io.github.bbortt.event.planner;

import com.tngtech.archunit.core.importer.ImportOption.DoNotIncludeTests;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import io.github.bbortt.event.planner.audit.EntityAuditEventListener;
import io.github.bbortt.event.planner.domain.AbstractAuditingEntity;
import io.github.bbortt.event.planner.domain.Member;
import io.github.bbortt.event.planner.security.SecurityUtils;
import io.github.bbortt.event.planner.web.rest.errors.EntityNotFoundAlertException;

import static com.tngtech.archunit.base.DescribedPredicate.alwaysTrue;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.belongToAnyOf;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.resideInAPackage;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.type;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

@AnalyzeClasses(packagesOf = EventPlannerApp.class, importOptions = DoNotIncludeTests.class)
class TechnicalStructureTest {

    // prettier-ignore
    @ArchTest
    static final ArchRule respectsTechnicalArchitectureLayers = layeredArchitecture()
        .consideringAllDependencies()
        .layer("Config").definedBy("..config..")
        .layer("Web").definedBy("..web..")
        .optionalLayer("Service").definedBy("..service..")
        .layer("Security").definedBy("..security..")
        .layer("Persistence").definedBy("..repository..")
        .layer("Domain").definedBy("..domain..")
        .layer("Mail").definedBy("..mail..")

        .whereLayer("Config").mayNotBeAccessedByAnyLayer()
        .whereLayer("Web").mayOnlyBeAccessedByLayers("Config")
        .whereLayer("Service").mayOnlyBeAccessedByLayers("Web", "Config", "Mail")
        .whereLayer("Security").mayOnlyBeAccessedByLayers("Config", "Service", "Web")
        .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Service", "Security", "Web", "Config")
        .whereLayer("Domain").mayOnlyBeAccessedByLayers("Persistence", "Service", "Security", "Web", "Config")

        .ignoreDependency(resideInAPackage("io.github.bbortt.event.planner.audit"), alwaysTrue())
        .ignoreDependency( resideInAPackage("io.github.bbortt.event.planner.service"),type(EntityNotFoundAlertException.class))
        .ignoreDependency(type(AbstractAuditingEntity.class), type(EntityAuditEventListener.class))
        .ignoreDependency(type(Member.class), type(SecurityUtils.class))
        .ignoreDependency(belongToAnyOf(EventPlannerApp.class), alwaysTrue())
        .ignoreDependency(alwaysTrue(), belongToAnyOf(
            io.github.bbortt.event.planner.config.Constants.class,
            io.github.bbortt.event.planner.config.ApplicationProperties.class
        ));
}
