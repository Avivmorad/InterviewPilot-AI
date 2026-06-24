import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import {
  EXPERIENCE_LEVELS,
  INTERVIEW_ROLES,
  LEVELS,
  ROLES,
  getLevelLabel,
  getRoleLabel,
} from './interview'

describe('interview shared configuration', () => {
  it('includes Generative AI Engineer once in the role source of truth', () => {
    const matchingRoles = INTERVIEW_ROLES.filter(
      (role) => role.value === 'generative-ai-engineer',
    )

    assert.equal(matchingRoles.length, 1)
    assert.equal(matchingRoles[0]?.label, 'Generative AI Engineer')
    assert.equal(getRoleLabel('generative-ai-engineer'), 'Generative AI Engineer')
    assert.deepEqual(
      ROLES,
      INTERVIEW_ROLES.map((role) => role.value),
    )
  })

  it('includes Intern once in the level source of truth', () => {
    const matchingLevels = EXPERIENCE_LEVELS.filter(
      (level) => level.value === 'intern',
    )

    assert.equal(matchingLevels.length, 1)
    assert.equal(matchingLevels[0]?.label, 'Intern')
    assert.equal(getLevelLabel('intern'), 'Intern')
    assert.deepEqual(
      LEVELS,
      EXPERIENCE_LEVELS.map((level) => level.value),
    )
  })
})
