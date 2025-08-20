"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Input } from '@/components/ui';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';

export default function StyleGuide() {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div variants={fadeIn} className="text-center mb-16">
          <h1 className="text-display-lg text-gradient font-robotics mb-4">
            Design System
          </h1>
          <p className="text-xl text-foreground-secondary max-w-3xl mx-auto">
            A comprehensive design system for the robotics portfolio, featuring modern components, 
            animations, and accessibility-first design principles.
          </p>
        </motion.div>

        {/* Color Palette */}
        <motion.section variants={slideUp} className="mb-16">
          <h2 className="text-3xl font-bold text-robotics mb-8">Color Palette</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Brand Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-brand-primary"></div>
                    <div>
                      <p className="font-semibold">Primary</p>
                      <p className="text-sm text-foreground-muted">#E11D48</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-brand-secondary"></div>
                    <div>
                      <p className="font-semibold">Secondary</p>
                      <p className="text-sm text-foreground-muted">#0EA5E9</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-brand-accent"></div>
                    <div>
                      <p className="font-semibold">Accent</p>
                      <p className="text-sm text-foreground-muted">#8B5CF6</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Robotics Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Robotics Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-electric"></div>
                    <div>
                      <p className="font-semibold">Electric</p>
                      <p className="text-sm text-foreground-muted">#06B6D4</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neon"></div>
                    <div>
                      <p className="font-semibold">Neon</p>
                      <p className="text-sm text-foreground-muted">#10B981</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-circuit"></div>
                    <div>
                      <p className="font-semibold">Circuit</p>
                      <p className="text-sm text-foreground-muted">#F59E0B</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Status Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-success"></div>
                    <div>
                      <p className="font-semibold">Success</p>
                      <p className="text-sm text-foreground-muted">#10B981</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-warning"></div>
                    <div>
                      <p className="font-semibold">Warning</p>
                      <p className="text-sm text-foreground-muted">#F59E0B</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-error"></div>
                    <div>
                      <p className="font-semibold">Error</p>
                      <p className="text-sm text-foreground-muted">#EF4444</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Typography */}
        <motion.section variants={slideUp} className="mb-16">
          <h2 className="text-3xl font-bold text-robotics mb-8">Typography</h2>
          
          <Card>
            <CardContent className="space-y-6">
              <div>
                <h1 className="text-display-lg text-gradient font-robotics">Display Large</h1>
                <p className="text-sm text-foreground-muted">font-robotics, text-display-lg</p>
              </div>
              <div>
                <h1 className="text-6xl font-bold">Heading 1</h1>
                <p className="text-sm text-foreground-muted">text-6xl, font-bold</p>
              </div>
              <div>
                <h2 className="text-4xl font-semibold">Heading 2</h2>
                <p className="text-sm text-foreground-muted">text-4xl, font-semibold</p>
              </div>
              <div>
                <h3 className="text-2xl font-medium">Heading 3</h3>
                <p className="text-sm text-foreground-muted">text-2xl, font-medium</p>
              </div>
              <div>
                <p className="text-lg">Large body text for emphasis and lead paragraphs.</p>
                <p className="text-sm text-foreground-muted">text-lg</p>
              </div>
              <div>
                <p className="text-base">Regular body text for most content and descriptions.</p>
                <p className="text-sm text-foreground-muted">text-base</p>
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Small text for captions and secondary information.</p>
                <p className="text-xs text-foreground-muted">text-sm</p>
              </div>
              <div>
                <code className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                  const robotics = &quot;awesome&quot;;
                </code>
                <p className="text-sm text-foreground-muted">font-mono for code</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Buttons */}
        <motion.section variants={slideUp} className="mb-16">
          <h2 className="text-3xl font-bold text-robotics mb-8">Buttons</h2>
          
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Primary</h3>
                  <div className="space-y-2">
                    <Button variant="primary" size="sm">Small</Button>
                    <Button variant="primary" size="md">Medium</Button>
                    <Button variant="primary" size="lg">Large</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Secondary</h3>
                  <div className="space-y-2">
                    <Button variant="secondary" size="sm">Small</Button>
                    <Button variant="secondary" size="md">Medium</Button>
                    <Button variant="secondary" size="lg">Large</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Robotics</h3>
                  <div className="space-y-2">
                    <Button variant="robotics" size="sm">Small</Button>
                    <Button variant="robotics" size="md">Medium</Button>
                    <Button variant="robotics" size="lg">Large</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Ghost</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm">Small</Button>
                    <Button variant="ghost" size="md">Medium</Button>
                    <Button variant="ghost" size="lg">Large</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Loading</h3>
                  <div className="space-y-2">
                    <Button variant="primary" loading size="md">Loading</Button>
                    <Button variant="secondary" disabled size="md">Disabled</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">With Icons</h3>
                  <div className="space-y-2">
                    <Button variant="primary" size="md" icon={<span>→</span>}>
                      Next
                    </Button>
                    <Button variant="secondary" size="md" icon={<span>←</span>} iconPosition="left">
                      Back
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Cards */}
        <motion.section variants={slideUp} className="mb-16">
          <h2 className="text-3xl font-bold text-robotics mb-8">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Standard card with shadow and hover effects.</p>
              </CardContent>
            </Card>

            <Card variant="glow">
              <CardHeader>
                <CardTitle>Glow Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enhanced with subtle glow effects for emphasis.</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Glass Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Glassmorphism effect with backdrop blur.</p>
              </CardContent>
            </Card>

            <Card variant="robotics">
              <CardHeader>
                <CardTitle>Robotics Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Dark theme with electric blue accents and glow.</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Badges */}
        <motion.section variants={slideUp} className="mb-16">
          <h2 className="text-3xl font-bold text-robotics mb-8">Badges</h2>
          
          <Card>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="robotics">Robotics</Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="primary" size="sm">Small</Badge>
                    <Badge variant="primary" size="md">Medium</Badge>
                    <Badge variant="primary" size="lg">Large</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Animated</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="robotics" animate>Animated</Badge>
                    <Badge variant="primary" animate>Primary</Badge>
                    <Badge variant="success" animate>Success</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Inputs */}
        <motion.section variants={slideUp} className="mb-16">
          <h2 className="text-3xl font-bold text-robotics mb-8">Form Inputs</h2>
          
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    label="Default Input"
                    placeholder="Enter text here..."
                    helper="This is helper text"
                  />
                  
                  <Input
                    label="With Icon"
                    placeholder="search@example.com"
                    icon={<span>@</span>}
                    iconPosition="left"
                  />
                  
                  <Input
                    label="Error State"
                    placeholder="Enter valid email"
                    error="Please enter a valid email address"
                    defaultValue="invalid-email"
                  />
                </div>
                
                <div className="space-y-4">
                  <Input
                    variant="robotics"
                    label="Robotics Theme"
                    placeholder="Enter robotic command..."
                    helper="Dark theme with electric accents"
                  />
                  
                  <Input
                    label="Disabled State"
                    placeholder="Disabled input"
                    disabled
                    defaultValue="Cannot edit this"
                  />
                  
                  <Input
                    label="Right Icon"
                    placeholder="Search..."
                    icon={<span>🔍</span>}
                    iconPosition="right"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Gradient Examples */}
        <motion.section variants={slideUp} className="mb-16">
          <h2 className="text-3xl font-bold text-robotics mb-8">Gradients & Effects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-fuchsia-400/20 to-cyan-400/20">
              <CardContent className="text-center py-12">
                <h3 className="text-gradient font-semibold text-xl">Fuchsia to Cyan</h3>
                <p className="text-foreground-muted mt-2">Hero gradient</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-brand-primary/20 to-brand-accent/20">
              <CardContent className="text-center py-12">
                <h3 className="text-gradient-brand font-semibold text-xl">Brand Gradient</h3>
                <p className="text-foreground-muted mt-2">Primary brand colors</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-electric/20 to-neon/20">
              <CardContent className="text-center py-12">
                <h3 className="font-semibold text-xl text-electric">Electric to Neon</h3>
                <p className="text-foreground-muted mt-2">Robotics theme</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Animation Examples */}
        <motion.section variants={slideUp} className="mb-16">
          <h2 className="text-3xl font-bold text-robotics mb-8">Animations</h2>
          
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-brand-primary rounded-full mx-auto animate-pulse-glow"></div>
                  <p className="font-semibold">Pulse Glow</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">animate-pulse-glow</code>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-electric rounded-full mx-auto animate-float"></div>
                  <p className="font-semibold">Float</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">animate-float</code>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-neon rounded-full mx-auto animate-bounce-gentle"></div>
                  <p className="font-semibold">Gentle Bounce</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">animate-bounce-gentle</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

      </div>
    </motion.div>
  );
}