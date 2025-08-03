# Codebase Modification Guidelines

## Overview
This document establishes clear guidelines for AI-assisted development to prevent common anti-patterns that lead to technical debt, particularly the creation of parallel/duplicate systems instead of enhancing existing code.

## Core Philosophy
**ENHANCE, DON'T REPLACE** - Always improve existing code rather than creating parallel implementations.

---

## Prime Directive Instructions for AI Development

### 1. Risk Aversion → Confidence Building
**MODIFY EXISTING CODE FIRST**: Always enhance existing components/files rather than creating parallel versions. If you're unsure about breaking changes, ask for confirmation of the approach before proceeding. Working code that builds incrementally is preferred over "safe" duplicate implementations.

### 2. Incomplete Understanding → Forced Analysis
**ANALYZE BEFORE ACTING**: Before making any changes, you MUST first read and understand the existing codebase structure. Use `read_file`, `grep_search`, and `semantic_search` to fully grasp what exists. Summarize your understanding and proposed changes before implementing.

### 3. Scope Creep → Focused Enhancement
**ENHANCE, DON'T REPLACE**: When asked to improve functionality, modify existing components to add the new features. Only create new components when genuinely new functionality is needed that doesn't fit existing patterns. Always explain why you're creating new vs. modifying existing.

### 4. Poor Planning → Explicit Strategy
**PLAN THEN EXECUTE**: Before coding, outline your strategy:
1. What existing code will be modified?
2. What the enhancement will look like?
3. How it maintains backward compatibility?
4. What will be removed/deprecated?

Wait for approval of the plan before implementing.

---

## Mandatory Codebase Modification Rules

### ✅ DO:
1. **ENHANCE EXISTING CODE FIRST** - Never create parallel components without explicit justification
2. **ANALYZE THOROUGHLY** - Read existing code completely before making changes
3. **EXPLAIN YOUR APPROACH** - Describe what you'll modify and why before coding
4. **MAINTAIN COMPATIBILITY** - Preserve existing interfaces while adding features
5. **REMOVE DEAD CODE** - Delete truly obsolete code as part of the enhancement
6. **ASK WHEN UNCERTAIN** - If unsure whether to modify vs. create new, ask first

### ❌ AVOID:
- Creating "Enhanced" versions of existing components
- Leaving old code untouched "just in case"
- Adding features without understanding existing architecture
- Making wholesale replacements instead of incremental improvements
- Creating parallel file structures
- Abandoning existing patterns without justification

---

## Prompt Instructions for Developers

### When Requesting Enhancements:
Use these directive phrases:
- "Modify the existing [component] to include..."
- "Enhance [existing file] by adding..."
- "Update the current implementation to support..."
- "Refactor [existing code] to handle..."

### Composite Instructions Template:
```markdown
CODEBASE MODIFICATION RULES:
1. ENHANCE EXISTING CODE FIRST - Never create parallel components without explicit justification
2. ANALYZE THOROUGHLY - Read existing code completely before making changes  
3. EXPLAIN YOUR APPROACH - Describe what you'll modify and why before coding
4. MAINTAIN COMPATIBILITY - Preserve existing interfaces while adding features
5. REMOVE DEAD CODE - Delete truly obsolete code as part of the enhancement
6. ASK WHEN UNCERTAIN - If you're unsure whether to modify vs. create new, ask me first

ANTI-PATTERNS TO AVOID:
- Creating "Enhanced" versions of existing components
- Leaving old code untouched "just in case"
- Adding features without understanding existing architecture
- Making wholesale replacements instead of incremental improvements
```

---

## Common Anti-Patterns and Solutions

### Anti-Pattern: Parallel Components
❌ **Wrong**: Creating `EnhancedHarmonicsDisplay.tsx` alongside existing `HarmonicsDisplay.tsx`
✅ **Right**: Enhancing `HarmonicsDisplay.tsx` with new tabbed functionality

### Anti-Pattern: Feature Duplication
❌ **Wrong**: Implementing similar functionality in multiple components
✅ **Right**: Extracting common functionality to shared utilities or base components

### Anti-Pattern: Interface Abandonment
❌ **Wrong**: Changing component interfaces without considering existing usage
✅ **Right**: Extending interfaces while maintaining backward compatibility

### Anti-Pattern: Dead Code Accumulation
❌ **Wrong**: Leaving deprecated code "just in case"
✅ **Right**: Removing obsolete code as part of the enhancement process

---

## Implementation Strategy

### Phase 1: Analysis
1. **Understand Current State**
   - Read all relevant existing files
   - Map component relationships
   - Identify integration points
   - Document current interfaces

2. **Plan Enhancement**
   - Define what functionality will be added
   - Determine which files need modification
   - Plan interface changes (if any)
   - Identify code to be removed

### Phase 2: Implementation
1. **Incremental Enhancement**
   - Modify existing files to add new features
   - Preserve existing functionality during transition
   - Update interfaces gradually
   - Test at each step

2. **Cleanup**
   - Remove obsolete code
   - Update documentation
   - Verify all integrations work
   - Update type definitions

### Phase 3: Validation
1. **Compatibility Check**
   - Ensure all existing usage still works
   - Verify new features integrate properly
   - Test edge cases and error scenarios
   - Validate performance impact

---

## Exception Cases

### When New Components Are Justified:
1. **Genuinely New Functionality** - Features that don't fit existing patterns
2. **Different Abstraction Level** - Utilities vs. UI components
3. **Performance Requirements** - Specialized implementations for specific use cases
4. **Deprecation Strategy** - Planned replacement with migration path

### Process for Exceptions:
1. **Explicit Justification** - Document why new component is needed
2. **Migration Plan** - How/when old code will be removed
3. **Interface Design** - How new component fits the existing system
4. **Timeline** - Clear plan for consolidation

---

## Success Metrics

### Technical Debt Reduction:
- ✅ No duplicate functionality
- ✅ Clear component hierarchy
- ✅ Minimal dead code
- ✅ Consistent interfaces

### Development Efficiency:
- ✅ Single source of truth for features
- ✅ Clear enhancement pathways
- ✅ Predictable change patterns
- ✅ Reduced maintenance overhead

### Code Quality:
- ✅ Cohesive component design
- ✅ Clear separation of concerns
- ✅ Maintainable architecture
- ✅ Future-proof patterns

---

## Document Maintenance

This document should be updated when:
- New anti-patterns are identified
- Development processes change
- Tool capabilities evolve
- Project requirements shift

**Last Updated**: August 3, 2025  
**Version**: 1.0  
**Next Review**: Quarterly or as needed
