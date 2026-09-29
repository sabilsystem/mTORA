'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  Badge,
  Modal,
  FloatingWhatsApp,
  Container,
  Stack,
  Grid,
} from '@/components/common';

export default function DesignSystemPreviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>('pack5');
  const [inputValue, setInputValue] = useState('');
  const [hasInputError, setHasInputError] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  return (
    <main style={{ minHeight: '100vh', padding: 'var(--space-8) 0', backgroundColor: 'var(--color-surface-bg)' }}>
      <Container maxWidth="default">
        <Stack gap={8}>
          {/* Header */}
          <header>
            <Badge variant="wheat" size="sm">Phase 1 Design System</Badge>
            <h1 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'clamp(1.75rem, 6vw, var(--text-4xl))', color: 'var(--color-brand-primary)', marginTop: 'var(--space-2)' }}>
              MTORA V2 UI Foundation
            </h1>
            <p style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
              Design tokens, typography scale, responsive primitives, and shared atomic components.
            </p>
          </header>

          {/* Color Palette Tokens */}
          <section aria-labelledby="palette-heading">
            <h2 id="palette-heading" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBottom: 'var(--space-4)' }}>
              1. Color Palette Tokens
            </h2>
            <Grid columns={{ sm: 1, md: 3, lg: 5 }} gap={3}>
              <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-brand-primary)', color: 'var(--color-text-inverse)' }}>
                <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>Brand Primary</strong>
                <code style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>#363A2D</code>
              </div>
              <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-card)', border: '1px solid var(--color-surface-border)' }}>
                <strong style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>Surface Card</strong>
                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>#FAF3E7</code>
              </div>
              <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-accent-wheat)', color: 'var(--color-brand-primary)' }}>
                <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>Accent Wheat</strong>
                <code style={{ fontSize: 'var(--text-xs)', opacity: 0.8 }}>#C79A4B</code>
              </div>
              <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-semantic-success-bg)', border: '1px solid rgba(46,125,50,0.2)', color: 'var(--color-semantic-success)' }}>
                <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>Success State</strong>
                <code style={{ fontSize: 'var(--text-xs)' }}>#2E7D32</code>
              </div>
              <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-semantic-error-bg)', border: '1px solid rgba(211,47,47,0.2)', color: 'var(--color-semantic-error)' }}>
                <strong style={{ display: 'block', fontSize: 'var(--text-sm)' }}>Error State</strong>
                <code style={{ fontSize: 'var(--text-xs)' }}>#D32F2F</code>
              </div>
            </Grid>
          </section>

          {/* Typography System */}
          <section aria-labelledby="typography-heading">
            <h2 id="typography-heading" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBottom: 'var(--space-4)' }}>
              2. Typography System
            </h2>
            <Card variant="default" padding="lg">
              <Stack gap={4}>
                <div>
                  <Badge variant="neutral" size="sm">Display / Space Grotesk</Badge>
                  <p style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-brand-primary)', marginTop: 'var(--space-1)' }}>
                    Fresh High-Protein Roti Handcrafted in Attapur
                  </p>
                </div>
                <div>
                  <Badge variant="neutral" size="sm">Body / Inter</Badge>
                  <p style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--text-base)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
                    Each roti packs 15g of pure vegetarian protein made with wheat, pea protein, and natural seeds. Soft, delicious, and digestible.
                  </p>
                </div>
                <div>
                  <Badge variant="neutral" size="sm">Utility / Space Mono</Badge>
                  <p style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                    BATCH: HYD-2026-09 | ORDER ID: MT-48201 | 15.2g PROTEIN / SERVING
                  </p>
                </div>
              </Stack>
            </Card>
          </section>

          {/* Button Atomic Primitive */}
          <section aria-labelledby="buttons-heading">
            <h2 id="buttons-heading" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBottom: 'var(--space-4)' }}>
              3. Button Primitives
            </h2>
            <Card variant="default" padding="lg">
              <Stack gap={4}>
                <Stack direction="row" wrap gap={3} align="center">
                  <Button variant="primary" size="md">
                    Primary CTA
                  </Button>
                  <Button variant="secondary" size="md">
                    Secondary Dark
                  </Button>
                  <Button variant="outline" size="md">
                    Outline Button
                  </Button>
                  <Button variant="wheat-outline" size="md">
                    Wheat Outline
                  </Button>
                  <Button variant="ghost" size="md">
                    Ghost Action
                  </Button>
                  <Button variant="pill" size="md">
                    Pill Variant
                  </Button>
                </Stack>

                <Stack direction="row" wrap gap={3} align="center">
                  <Button variant="primary" size="sm">Small (36px)</Button>
                  <Button variant="primary" size="md">Medium (48px)</Button>
                  <Button variant="primary" size="lg">Large (56px)</Button>
                  <Button
                    variant="primary"
                    isLoading={isBtnLoading}
                    onClick={() => {
                      setIsBtnLoading(true);
                      setTimeout(() => setIsBtnLoading(false), 2000);
                    }}
                  >
                    {isBtnLoading ? 'Processing...' : 'Click to Test Loading'}
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled Button
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </section>

          {/* Input Atomic Primitive */}
          <section aria-labelledby="inputs-heading">
            <h2 id="inputs-heading" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBottom: 'var(--space-4)' }}>
              4. Input Primitives
            </h2>
            <Card variant="default" padding="lg">
              <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap={4}>
                <Input
                  label="Mobile Number (with +91 prefix)"
                  placeholder="9876543210"
                  prefix="+91"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  helperText="Standard 10-digit Indian mobile number"
                />

                <Input
                  label="Validation State Input"
                  placeholder="Type to test error..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setHasInputError(e.target.value.length > 0 && e.target.value.length < 5);
                  }}
                  error={hasInputError ? 'Must contain at least 5 characters' : undefined}
                  helperText="Enter 5 or more characters to clear error"
                />

                <Input
                  label="Disabled Input"
                  value="Read-only or Disabled state"
                  disabled
                  helperText="Field is currently locked"
                />
              </Grid>
            </Card>
          </section>

          {/* Card & Selection States */}
          <section aria-labelledby="cards-heading">
            <h2 id="cards-heading" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBottom: 'var(--space-4)' }}>
              5. Card & Selection Primitives
            </h2>
            <Grid columns={{ sm: 1, md: 3 }} gap={4}>
              <Card
                variant="default"
                padding="md"
                selectable
                isSelected={selectedCard === 'pack1'}
                onClick={() => setSelectedCard('pack1')}
              >
                <Badge variant="neutral" size="sm">Single Pack</Badge>
                <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-xl)', marginTop: 'var(--space-2)' }}>Pack of 1</h3>
                <p style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-brand-primary)' }}>₹45</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>15g protein • Trial portion</p>
              </Card>

              <Card
                variant="default"
                padding="md"
                selectable
                isSelected={selectedCard === 'pack2'}
                onClick={() => setSelectedCard('pack2')}
              >
                <Badge variant="wheat" size="sm">Popular</Badge>
                <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-xl)', marginTop: 'var(--space-2)' }}>Pack of 2</h3>
                <p style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-brand-primary)' }}>₹80</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>30g protein • Daily dinner</p>
              </Card>

              <Card
                variant="default"
                padding="md"
                selectable
                isSelected={selectedCard === 'pack5'}
                onClick={() => setSelectedCard('pack5')}
              >
                <Badge variant="success" size="sm">10% OFF • Best Value</Badge>
                <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-xl)', marginTop: 'var(--space-2)' }}>Pack of 5</h3>
                <p style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-brand-primary)' }}>₹160</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>75g protein • Family pack</p>
              </Card>
            </Grid>
          </section>

          {/* Badge Status Chips */}
          <section aria-labelledby="badges-heading">
            <h2 id="badges-heading" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBottom: 'var(--space-4)' }}>
              6. Badge Status Chips
            </h2>
            <Card variant="default" padding="md">
              <Stack direction="row" wrap gap={3} align="center">
                <Badge variant="wheat">10% OFF</Badge>
                <Badge variant="success">Free Delivery</Badge>
                <Badge variant="success">Delivered</Badge>
                <Badge variant="warning">Cutoff Passed</Badge>
                <Badge variant="error">Payment Failed</Badge>
                <Badge variant="neutral">Home Address</Badge>
                <Badge variant="dark">15g Protein / Roti</Badge>
              </Stack>
            </Card>
          </section>

          {/* Modal / Bottom Sheet Drawer */}
          <section aria-labelledby="modal-heading">
            <h2 id="modal-heading" style={{ fontFamily: 'var(--font-family-display)', fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBottom: 'var(--space-4)' }}>
              7. Accessible Modal & Drawer Primitive
            </h2>
            <Card variant="default" padding="lg">
              <Stack gap={3}>
                <p style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  Accessible dialog with focus trapping, backdrop blur, Escape dismissal, and automatic bottom sheet drawer styling on mobile (&lt; 640px).
                </p>
                <div>
                  <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                    Open Test Dialog / Mobile Drawer
                  </Button>
                </div>
              </Stack>
            </Card>

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Interactive Modal Preview"
              description="Demonstrating focus trap, Esc key listener, and mobile bottom drawer transformation."
              footer={
                <Stack direction="row" gap={2}>
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                    Confirm Action
                  </Button>
                </Stack>
              }
            >
              <Stack gap={4}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                  This modal renders through a React portal to <code>document.body</code>, locks body scrolling, and traps focus. On viewports below 640px, it slides up as an action sheet drawer with a drag handle.
                </p>
                <Input label="Sample Modal Input" placeholder="Type here..." autoFocus />
              </Stack>
            </Modal>
          </section>
        </Stack>
      </Container>

      {/* Floating WhatsApp Support Button */}
      <FloatingWhatsApp
        label="Order Help"
        showTooltip={true}
        message="Hi mTORA, testing the Phase 1 FloatingWhatsApp component."
      />
    </main>
  );
}
