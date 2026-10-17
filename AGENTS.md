# Architecture rules
- Portfolio views share the existing AdminContext content and persistence; presentation changes must not duplicate or replace stored content.
- Project classification and filtering live in a pure portfolio utility so overview, full catalog and search share the same rules.
- Use existing report records for case studies; never fabricate impact metrics, production status or repository URLs.
- Enterprise visuals use semantic global tokens and shared design-system controls; animated effects must respect reduced motion.