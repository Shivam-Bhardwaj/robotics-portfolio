import React from 'react'
import { render, screen } from '@testing-library/react'
import SkillBadge from '@/components/SkillBadge'

describe('SkillBadge', () => {
  it('renders skill name', () => {
    render(<SkillBadge name="Python" />)
    
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('displays correct emoji for known skills', () => {
    const knownSkills = [
      { name: 'Python', emoji: '🐍' },
      { name: 'C++', emoji: '⚙️' },
      { name: 'ROS', emoji: '🤖' },
      { name: 'OpenCV', emoji: '👁️' },
      { name: 'PyTorch', emoji: '🔥' },
      { name: 'TensorFlow', emoji: '🧠' },
      { name: 'Docker', emoji: '🐳' },
      { name: 'Git', emoji: '🌿' },
    ]

    knownSkills.forEach(({ name, emoji }) => {
      render(<SkillBadge name={name} />)
      expect(screen.getByText(emoji)).toBeInTheDocument()
      screen.getByText(emoji).remove() // Clean up for next iteration
    })
  })

  it('displays default emoji for unknown skills', () => {
    render(<SkillBadge name="UnknownSkill" />)
    
    expect(screen.getByText('✨')).toBeInTheDocument()
    expect(screen.getByText('UnknownSkill')).toBeInTheDocument()
  })

  it('has proper styling classes', () => {
    render(<SkillBadge name="Python" />)
    
    const badge = screen.getByText('Python').parentElement
    expect(badge).toHaveClass(
      'bg-gray-100',
      'text-gray-800',
      'px-3',
      'py-1',
      'rounded-full',
      'border',
      'border-gray-200',
      'shadow-sm',
      'hover:shadow',
      'transition'
    )
  })

  it('has proper emoji accessibility attributes', () => {
    render(<SkillBadge name="Python" />)
    
    const emojiSpan = screen.getByText('🐍')
    expect(emojiSpan).toHaveAttribute('aria-hidden')
    expect(emojiSpan).toHaveClass('mr-1')
  })

  describe('Edge Cases', () => {
    it('handles empty skill name', () => {
      render(<SkillBadge name="" />)
      
      expect(screen.getByText('✨')).toBeInTheDocument()
    })

    it('handles skill names with special characters', () => {
      render(<SkillBadge name="C#/.NET" />)
      
      expect(screen.getByText('C#/.NET')).toBeInTheDocument()
      expect(screen.getByText('✨')).toBeInTheDocument()
    })

    it('handles very long skill names', () => {
      const longName = 'VeryLongSkillNameThatShouldStillWork'
      render(<SkillBadge name={longName} />)
      
      expect(screen.getByText(longName)).toBeInTheDocument()
    })

    it('handles skill names with different casing', () => {
      render(<SkillBadge name="python" />)
      
      expect(screen.getByText('python')).toBeInTheDocument()
      expect(screen.getByText('✨')).toBeInTheDocument() // Should use default emoji for different casing
    })
  })

  describe('Accessibility', () => {
    it('provides accessible content', () => {
      render(<SkillBadge name="Python" />)
      
      const badge = screen.getByText('Python').parentElement
      expect(badge).toBeVisible()
    })

    it('emoji is marked as decorative', () => {
      render(<SkillBadge name="Python" />)
      
      const emoji = screen.getByText('🐍')
      expect(emoji).toHaveAttribute('aria-hidden')
    })
  })

  describe('Visual States', () => {
    it('has hover transition class', () => {
      render(<SkillBadge name="Python" />)
      
      const badge = screen.getByText('Python').parentElement
      expect(badge).toHaveClass('hover:shadow', 'transition')
    })

    it('has proper border and shadow', () => {
      render(<SkillBadge name="Python" />)
      
      const badge = screen.getByText('Python').parentElement
      expect(badge).toHaveClass('border', 'border-gray-200', 'shadow-sm')
    })
  })

  describe('Performance', () => {
    it('renders multiple badges efficiently', () => {
      const skills = ['Python', 'C++', 'ROS', 'OpenCV', 'PyTorch']
      
      const { container } = render(
        <div>
          {skills.map(skill => (
            <SkillBadge key={skill} name={skill} />
          ))}
        </div>
      )
      
      expect(container.children[0].children).toHaveLength(5)
      skills.forEach(skill => {
        expect(screen.getByText(skill)).toBeInTheDocument()
      })
    })
  })
})