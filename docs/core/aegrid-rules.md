# The Aegrid Rules - Core North Star

**Version**: 1.0  
**Date**: January 15, 2025  
**Status**: Core Principles - Non-Negotiable

## Purpose

The Aegrid Rules serve as the foundational principles that guide every decision, feature, and interaction within the Aegrid platform. These rules are not suggestions or guidelines—they are the core north star that ensures Aegrid delivers genuine value to organisations managing critical assets.

## The Four Aegrid Rules

### Rule 1: Every Asset Has a Purpose
**"Assets are not just items to be owned or managed; they exist to deliver service, function, or value."**

#### What This Means
- Every asset in the system must be linked to a clear business purpose
- Asset management decisions are driven by service delivery, not just ownership
- Asset value is measured by its contribution to organisational objectives
- Assets without clear purpose should be questioned, not just maintained

#### Implementation Principles: Function-Based Anchoring
- **Structure assets around what they do (their service purpose), not just where they sit**
- **Hierarchies or tags should reflect intended function** (e.g., mowing, transport, lifting) so value is always visible
- **Avoid "miscellaneous" or "other" buckets** that obscure purpose
- **Purpose-Driven Asset Registration**: Every asset must have a defined service function
- **Value-Based Prioritisation**: Asset importance determined by service impact
- **Service-Level Tracking**: Monitor how assets contribute to service delivery
- **Purpose Validation**: Regular review of asset purpose and alignment with business goals

#### Technical Implementation
```cypher
// Function-based asset modeling
(asset:Asset)-[:PERFORMS_FUNCTION]->(function:ServiceFunction)
(function:ServiceFunction)-[:DELIVERS_VALUE]->(value:BusinessValue)
(asset:Asset)-[:TAGGED_WITH]->(tag:FunctionTag {type: "service_purpose"})

// Avoid generic categories
// BAD: (asset:Asset)-[:CATEGORISED_AS]->(category:Category {name: "Other"})
// GOOD: (asset:Asset)-[:PERFORMS_FUNCTION]->(function:ServiceFunction {name: "Mowing"})
```

#### User Story Alignment
- **US1.1**: As an Asset Manager, I want to define the service purpose of each asset so that I can align maintenance with business objectives
- **US1.2**: As a Manager, I want to see how assets contribute to service delivery so that I can prioritise investments
- **US1.3**: As an Executive, I want to understand asset value in terms of service impact so that I can make informed decisions

### Rule 2: Match Maintenance to Risk
**"Not all assets are equal — maintenance should be right-sized with RCM-lite to balance risk, cost, and service impact."**

#### What This Means
- Maintenance strategies must be proportional to asset risk and criticality
- One-size-fits-all maintenance approaches are inefficient and wasteful
- Risk assessment drives maintenance frequency, methods, and resource allocation
- Cost-benefit analysis ensures maintenance investment delivers appropriate returns

#### Implementation Principles: Criticality-Driven Grouping
- **Asset hierarchy should enable risk-based maintenance** by clearly tagging/structuring criticality, failure modes, and service impact
- **Allow grouping by condition, risk, and performance**, not just asset type or location
- **This supports RCM-lite approaches** — easy to filter assets into "inspect quarterly vs run-to-fail"
- **Risk-Based Maintenance**: Maintenance frequency and methods determined by risk assessment
- **RCM-Lite Methodology**: Simplified Reliability Centred Maintenance for practical implementation
- **Cost-Risk Optimization**: Balance maintenance costs against risk reduction benefits
- **Dynamic Adjustment**: Maintenance strategies adapt as risk profiles change

#### Technical Implementation
```cypher
// Risk-based asset grouping
(asset:Asset)-[:HAS_RISK]->(risk:RiskAssessment)
(risk:RiskAssessment)-[:DETERMINES]->(strategy:MaintenanceStrategy)
(asset:Asset)-[:TAGGED_WITH]->(tag:RiskTag {type: "criticality", value: "High"})
(asset:Asset)-[:TAGGED_WITH]->(tag:ConditionTag {type: "condition", value: "Poor"})

// RCM-lite grouping examples
// Quarterly inspection group
MATCH (asset:Asset)-[:TAGGED_WITH]->(tag:RiskTag {value: "Medium"})
WHERE asset.maintenanceStrategy = "Inspect Quarterly"
RETURN asset

// Run-to-fail group
MATCH (asset:Asset)-[:TAGGED_WITH]->(tag:RiskTag {value: "Low"})
WHERE asset.maintenanceStrategy = "Run to Fail"
RETURN asset
```

#### User Story Alignment
- **US2.1**: As a Maintenance Manager, I want to set maintenance strategies based on asset risk so that I can optimise resource allocation
- **US2.2**: As a Planner, I want to see risk-based maintenance recommendations so that I can create efficient schedules
- **US2.3**: As a Supervisor, I want to understand why maintenance is required so that I can execute with purpose

### Rule 3: Protect the Critical Few
**"Focus attention and resources on the assets whose failure would cause the greatest harm to safety, service, or reputation."**

#### What This Means
- Not all assets deserve equal attention—focus on those that matter most
- Critical asset identification is based on failure consequences, not just asset value
- Safety, service continuity, and reputation protection are the primary criteria
- Resource allocation must prioritise critical assets over non-critical ones

#### Implementation Principles: Visibility of Crown Jewels
- **Hierarchy must make the critical assets stand out from the noise**
- **Ensure the system can flag and elevate "high consequence" assets** in any view (finance, location, engineering)
- **Don't bury the vital 10% of assets in a deep tree** — surface them with tags, dashboards, or dedicated groupings
- **Critical Asset Identification**: Systematic process to identify truly critical assets
- **Consequence-Based Prioritisation**: Focus on failure impact, not just asset value
- **Resource Concentration**: Allocate disproportionate resources to critical assets
- **Continuous Monitoring**: Critical assets receive enhanced monitoring and attention

#### Technical Implementation
```cypher
// Critical asset visibility and elevation
(asset:Asset)-[:HAS_CONSEQUENCE]->(consequence:FailureConsequence)
(consequence:FailureConsequence)-[:IMPACTS]->(impact:ImpactArea {type: "Safety"})
(asset:Asset)-[:TAGGED_WITH]->(tag:CriticalityTag {type: "crown_jewel", value: "Critical"})

// Surface critical assets in all views
// Finance view
MATCH (asset:Asset)-[:TAGGED_WITH]->(tag:CriticalityTag {value: "Critical"})
RETURN asset.name, asset.value, asset.criticalityReason

// Location view  
MATCH (asset:Asset)-[:TAGGED_WITH]->(tag:CriticalityTag {value: "Critical"})
MATCH (asset)-[:LOCATED_AT]->(location:Location)
RETURN asset.name, location.name, asset.criticalityReason

// Engineering view
MATCH (asset:Asset)-[:TAGGED_WITH]->(tag:CriticalityTag {value: "Critical"})
MATCH (asset)-[:HAS_CONSEQUENCE]->(consequence:FailureConsequence)
RETURN asset.name, consequence.description, consequence.impactLevel
```

#### User Story Alignment
- **US3.1**: As a Risk Manager, I want to identify critical assets based on failure consequences so that I can protect what matters most
- **US3.2**: As a Manager, I want to see critical asset status at a glance so that I can ensure they receive proper attention
- **US3.3**: As a Supervisor, I want alerts for critical asset issues so that I can respond immediately

### Rule 4: Plan for Tomorrow, Today
**"Take a forward-looking view of asset decisions to ensure sustainability, resilience, and future service needs are met."**

#### What This Means
- Asset management decisions must consider long-term implications
- Sustainability and resilience are built into every asset decision
- Future service needs drive current asset planning and investment
- Short-term fixes must align with long-term strategic objectives

#### Implementation Principles: Flexible, Future-Proof Models
- **Use graph-based or tag-enabled hierarchies that can adapt** when organisations, depots, or funding models change
- **Avoid hardcoding today's org chart into the structure** — assets outlive reporting lines
- **Enable multiple views (ops, finance, compliance, digital twin)** without restructuring
- **Strategic Asset Planning**: Long-term view drives short-term decisions
- **Sustainability Integration**: Environmental and social considerations in asset decisions
- **Resilience Building**: Assets designed and maintained for future challenges
- **Future Service Alignment**: Asset planning anticipates changing service requirements

#### Technical Implementation
```cypher
// Flexible, future-proof asset modeling
(asset:Asset)-[:TAGGED_WITH]->(tag:ViewTag {type: "ops_view", value: "Operations"})
(asset:Asset)-[:TAGGED_WITH]->(tag:ViewTag {type: "finance_view", value: "Finance"})
(asset:Asset)-[:TAGGED_WITH]->(tag:ViewTag {type: "compliance_view", value: "Compliance"})
(asset:Asset)-[:TAGGED_WITH]->(tag:ViewTag {type: "digital_twin_view", value: "Digital Twin"})

// Multiple overlapping hierarchies
(asset:Asset)-[:BELONGS_TO]->(orgUnit:OrganisationalUnit)
(asset:Asset)-[:LOCATED_IN]->(depot:Depot)
(asset:Asset)-[:FUNDED_BY]->(fundingModel:FundingModel)

// Future scenario modeling
(asset:Asset)-[:PLANNED_FOR]->(scenario:FutureScenario)
(scenario:FutureScenario)-[:CONSIDERS]->(factor:SustainabilityFactor)
(scenario:FutureScenario)-[:CONSIDERS]->(factor:ResilienceFactor)

// Avoid hardcoded structures
// BAD: (asset:Asset)-[:BELONGS_TO_DEPARTMENT]->(dept:Department {name: "Current Dept"})
// GOOD: (asset:Asset)-[:TAGGED_WITH]->(tag:OrgTag {type: "department", value: "Current Dept", validFrom: "2025-01-01", validTo: "2025-12-31"})
```

#### User Story Alignment
- **US4.1**: As a Strategic Planner, I want to model long-term asset scenarios so that I can make informed investment decisions
- **US4.2**: As a Manager, I want to see sustainability impact of asset decisions so that I can align with environmental goals
- **US4.3**: As an Executive, I want to understand future service needs so that I can plan asset investments accordingly

## Cross-Cutting Principles

### Data-Driven Decision Making
Every rule implementation must be supported by data, analytics, and evidence. Gut feelings and assumptions have no place in asset management decisions.

### Continuous Improvement
The Aegrid Rules are not static—they evolve as we learn and as industry best practices develop. However, the core principles remain constant.

### User-Centric Design
While the rules guide the platform, they must be implemented in ways that serve users' needs and enhance their ability to deliver value.

### Transparency and Accountability
All decisions made under the Aegrid Rules must be transparent, auditable, and accountable to stakeholders.

## Implementation Framework

### Rule Integration in Features
Every feature must demonstrate how it supports one or more Aegrid Rules:

#### Feature Design Questions
1. **Rule 1 (Purpose)**: How does this feature help users understand and manage asset purpose?
2. **Rule 2 (Risk)**: How does this feature support risk-based maintenance decisions?
3. **Rule 3 (Critical)**: How does this feature help identify and protect critical assets?
4. **Rule 4 (Future)**: How does this feature support long-term planning and sustainability?

#### Epic Alignment
- **Strategic Overview Epic**: Primarily serves Rule 4 (Plan for Tomorrow, Today)
- **Asset Planning Epic**: Serves Rules 1, 2, and 4 (Purpose, Risk, Future)
- **Operations Management Epic**: Serves Rules 2 and 3 (Risk, Critical)
- **Community Engagement Epic**: Serves Rule 1 (Purpose through service delivery)
- **System Administration Epic**: Enables all rules through system support

### User Journey Alignment
Each user persona's journey must reflect the Aegrid Rules:

#### Executive Journey
- **Rule 1**: Understanding asset purpose in strategic context
- **Rule 3**: Monitoring critical asset performance
- **Rule 4**: Making long-term investment decisions

#### Manager Journey
- **Rule 1**: Aligning asset management with service delivery
- **Rule 2**: Implementing risk-based maintenance strategies
- **Rule 3**: Ensuring critical assets receive proper attention
- **Rule 4**: Planning for future service needs

#### Supervisor Journey
- **Rule 2**: Executing risk-based maintenance plans
- **Rule 3**: Prioritising critical asset work
- **Rule 4**: Implementing sustainable practices

#### Crew Journey
- **Rule 1**: Understanding why maintenance is performed
- **Rule 2**: Executing maintenance according to risk priorities
- **Rule 3**: Recognising and reporting critical asset issues

## Quality Gates

### Feature Acceptance Criteria
Every feature must pass these quality gates:

1. **Purpose Alignment**: Does the feature help users understand or manage asset purpose?
2. **Risk Integration**: Does the feature support risk-based decision making?
3. **Critical Focus**: Does the feature help identify or protect critical assets?
4. **Future Orientation**: Does the feature support long-term planning?

### User Story Validation
Every user story must answer:
- Which Aegrid Rule(s) does this story support?
- How does this story help users deliver value according to the rules?
- What evidence will demonstrate the story's success?

### Epic Success Criteria
Every epic must demonstrate:
- Clear alignment with one or more Aegrid Rules
- Measurable improvement in rule-based decision making
- User satisfaction with rule-based workflows
- Business value delivery through rule implementation

## Measurement and Metrics

### Rule 1 Metrics (Purpose)
- **Asset Purpose Coverage**: % of assets with defined service purpose
- **Purpose Alignment**: % of maintenance aligned with asset purpose
- **Service Impact Tracking**: Measurement of asset contribution to service delivery

### Rule 2 Metrics (Risk)
- **Risk-Based Maintenance**: % of maintenance scheduled based on risk assessment
- **Maintenance Efficiency**: Cost per unit of risk reduction
- **RCM-Lite Adoption**: % of assets using risk-based maintenance strategies

### Rule 3 Metrics (Critical)
- **Critical Asset Identification**: % of critical assets properly identified
- **Critical Asset Performance**: Uptime and reliability of critical assets
- **Resource Allocation**: % of resources allocated to critical vs non-critical assets

### Rule 4 Metrics (Future)
- **Strategic Planning**: % of asset decisions considering long-term implications
- **Sustainability Integration**: % of decisions incorporating sustainability factors
- **Future Service Alignment**: % of asset planning aligned with future service needs

## Governance and Compliance

### Rule Enforcement
- **Design Reviews**: All features reviewed for Aegrid Rules compliance
- **User Testing**: User acceptance testing includes rule-based scenarios
- **Performance Monitoring**: Continuous monitoring of rule-based metrics
- **Regular Audits**: Quarterly reviews of rule implementation and effectiveness

### Training and Education
- **User Training**: All users trained on Aegrid Rules and their application
- **Developer Training**: Development team trained on rule-based design
- **Management Training**: Leadership trained on rule-based decision making
- **Continuous Learning**: Regular updates on rule implementation best practices

## Conclusion

The Aegrid Rules are not just principles—they are the foundation upon which every aspect of the Aegrid platform is built. They ensure that we deliver genuine value to organisations managing critical assets, not just another software tool.

By following these rules, Aegrid becomes more than a platform—it becomes a partner in delivering reliable, efficient, and sustainable asset management that serves the real needs of organisations and their stakeholders.

**Remember**: Every decision, every feature, every interaction must be evaluated against these rules. They are our north star, our quality gate, and our promise to deliver value that matters.
