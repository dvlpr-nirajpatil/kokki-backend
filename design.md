# Kokki Design System

Version 1.0  
Last updated: 5 August 2026  
Status: Canonical product design guide

## 1. Purpose

This document defines the shared visual, interaction, content, and implementation standards for every Kokki digital product.

It applies to:

- Marketing websites and landing pages
- Customer damage-assessment and claim-assistance journeys
- Customer account and repair-tracking experiences
- Garage, surveyor, and insurance-partner portals
- Kokki claim-expert and operations tools
- Responsive web applications and embedded web modules
- Future mobile applications

The goal is not to make every screen look identical. The goal is to make every Kokki experience feel clear, dependable, premium, and unmistakably part of the same product family.

When this guide conflicts with a one-off screen treatment, this guide takes precedence unless the design-system owner approves an exception.

## 2. Canonical sources

The design system is currently represented by these sources:

- Design guidance: `design.md`
- Design tokens: `src/styles/tokens.css`
- Global foundations: `src/styles/global.css`
- Shared web components: `src/styles/components.css`
- React logo component: `src/components/brand/KokkiLogo.jsx`
- Standalone logo: `public/kokki-logo.svg`
- Browser icon: `public/favicon.svg`

Design decisions should be documented here before they are repeated across applications. Reusable values must be implemented as tokens rather than copied into individual modules.

## 3. Product and brand foundation

### 3.1 Positioning

Kokki is a digital vehicle repair and insurance-claim platform that helps vehicle owners estimate repair costs, understand likely insurance coverage, and coordinate cashless repairs through a trusted garage network.

Kokki is not positioned as a garage. Kokki coordinates the complete experience between the customer, claim expert, insurer, surveyor, and repair partner.

### 3.2 Core promise

> Know your likely repair cost before visiting a garage, then get help coordinating the insurance claim and repair.

The interface must communicate this promise before describing secondary services.

### 3.3 Primary audiences

| Audience           | Primary need                        | Interface priority                               |
| ------------------ | ----------------------------------- | ------------------------------------------------ |
| Vehicle owner      | Clarity after an accident           | Reassurance, simple actions, plain language      |
| Kokki claim expert | Coordinate cases efficiently        | Case state, exceptions, communication history    |
| Repair garage      | Receive accurate jobs and approvals | Repair scope, documents, status, payment clarity |
| Surveyor           | Review evidence and decisions       | Damage evidence, estimate details, auditability  |
| Insurance partner  | Understand claim progress and risk  | Structured data, compliance, transparent status  |

### 3.4 Brand personality

Kokki should feel:

- Clear, never vague
- Calm, never alarming
- Premium, never decorative for its own sake
- Human, never bureaucratic
- Expert, never overly technical
- Transparent, never absolute about uncertain outcomes
- Efficient, never rushed

### 3.5 Design principles

#### Clarity before persuasion

Explain what Kokki does, what the customer receives, and what happens next before introducing additional features.

#### Reassurance through structure

Accident repair is stressful. Use visible progress, specific next steps, restrained color, and predictable layouts to reduce uncertainty.

#### One primary action

Each screen or section should have one unmistakable primary action. Secondary actions must not compete with it.

#### Transparency over false certainty

Clearly distinguish an initial estimate from an approved repair amount or final insurance settlement.

#### Human assistance should be visible

Kokki is not only automated software. Interfaces should make it clear when a Kokki expert reviews, coordinates, or follows up on a case.

#### Density should match the task

Marketing pages can use expressive spacing. Customer workflows should be focused. Operations tools should be compact and information-rich.

#### Mobile is a primary context

Customers may begin the journey beside a damaged vehicle. Photo capture, document upload, WhatsApp contact, and progress tracking must work comfortably on a phone.

## 4. Non-negotiable experience rules

- Never describe an initial estimate as final or guaranteed.
- Never imply that Kokki approves an insurance claim.
- Never use “Submit Claim” for the initial assessment request.
- Never hide important exclusions or disclaimers behind tooltips alone.
- Never use color as the only way to communicate state.
- Never place critical actions below unnecessary decorative content.
- Never create nested page scrolling for ordinary forms. The page should scroll naturally.
- Never render a phone prefix as a second nested input. The prefix and number must appear as one unified control.
- Never present more than one dominant CTA in the same visual region.
- Never use generic automotive imagery that does not support the current message.

## 5. Design-system architecture

Kokki uses three token layers.

### 5.1 Primitive tokens

Primitive tokens store raw values such as green, charcoal, 16px, or a shadow definition. Components should not consume primitives directly when a semantic token exists.

### 5.2 Semantic tokens

Semantic tokens describe intent, such as `text-primary`, `surface-raised`, `action-primary`, or `status-danger`.

### 5.3 Component tokens

Component tokens describe local behavior, such as `button-primary-background`, `input-border-focus`, or `card-radius`.

This layering allows the brand palette or theme to change without rewriting every component.

## 6. Color system

### 6.1 Core palette

| Token                  | Value     | Primary use                                       |
| ---------------------- | --------- | ------------------------------------------------- |
| `--color-ink`          | `#151814` | Primary text and high-emphasis icons              |
| `--color-copy-strong`  | `#3f443d` | Strong supporting text                            |
| `--color-copy`         | `#565b53` | Body copy                                         |
| `--color-muted`        | `#777c73` | Secondary labels and metadata                     |
| `--color-subtle`       | `#92978e` | Disabled or low-priority information              |
| `--color-paper`        | `#f4f4ed` | Warm page background                              |
| `--color-paper-deep`   | `#e9eae1` | Section contrast and recessed areas               |
| `--color-surface`      | `#fbfcf8` | Default light surface                             |
| `--color-white`        | `#ffffff` | Raised cards and inverse text                     |
| `--color-line`         | `#dcded5` | Light borders and dividers                        |
| `--color-line-dark`    | `#30352e` | Borders on dark surfaces                          |
| `--color-dark`         | `#121612` | Primary dark surface and CTA                      |
| `--color-dark-soft`    | `#1b211b` | Secondary dark surface                            |
| `--color-accent`       | `#d0fa62` | Brand highlight and primary positive emphasis     |
| `--color-accent-hover` | `#bdea4b` | Accent hover state                                |
| `--color-accent-deep`  | `#496214` | Accessible green text and icons on light surfaces |
| `--color-success`      | `#3d8b59` | Confirmed success state                           |
| `--color-danger`       | `#a84d45` | Errors and destructive actions                    |

### 6.2 Semantic color roles

New applications should expose semantic aliases even when they currently map to the core palette.

```css
:root {
  --text-primary: var(--color-ink);
  --text-secondary: var(--color-copy);
  --text-muted: var(--color-muted);
  --text-inverse: var(--color-white);

  --surface-page: var(--color-surface);
  --surface-warm: var(--color-paper);
  --surface-raised: var(--color-white);
  --surface-recessed: var(--color-paper-deep);
  --surface-inverse: var(--color-dark);

  --border-default: var(--color-line);
  --border-inverse: var(--color-line-dark);
  --action-primary: var(--color-dark);
  --action-highlight: var(--color-accent);
  --focus-ring: rgb(154 197 51 / 42%);
}
```

### 6.3 Approved pairings

- Ink on white, surface, paper, or accent
- Copy on white, surface, or paper
- White on dark or dark-soft
- Accent on dark for small labels and highlights
- Accent-deep on white, surface, or paper
- Dark on accent for buttons, badges, and selected controls

### 6.4 Pairings to avoid

- Accent-colored body copy on white
- Muted or subtle text on paper when the copy is important
- White text directly on accent
- Danger red as decoration
- Large areas of saturated accent behind long-form content
- Low-opacity grey for labels, helper text, or legal information

### 6.5 Color distribution

For customer-facing light interfaces, use this approximate balance:

- 70–80% neutral light surfaces
- 15–25% charcoal text and dark surfaces
- 5–10% accent green

The accent color is a signal. Excessive use makes it less meaningful.

### 6.6 Status colors

| State       | Color direction          | Required companion                             |
| ----------- | ------------------------ | ---------------------------------------------- |
| Success     | Green                    | Check icon and explicit label                  |
| Warning     | Amber                    | Warning icon and actionable explanation        |
| Error       | Muted red                | Error icon or text and recovery instruction    |
| Information | Neutral blue or charcoal | Information icon and descriptive text          |
| Pending     | Neutral grey             | Clock/progress icon and timestamp where useful |

Add dedicated warning and information tokens before these states enter production. Do not improvise colors inside individual screens.

## 7. Typography

### 7.1 Typeface

Kokki uses Manrope Variable for display and body text.

```css
font-family: 'Manrope Variable', 'Manrope', ui-sans-serif, sans-serif;
```

Use system fallbacks so content remains readable while the primary font loads. Do not introduce a second typeface without design-system approval.

### 7.2 Weight guidance

| Weight  | Usage                                             |
| ------- | ------------------------------------------------- |
| 500–590 | Large marketing and page headings                 |
| 600–650 | Section headings, card titles, form labels        |
| 680–750 | Buttons, badges, tabs, navigation, small emphasis |
| 760–800 | Wordmark only or rare numeric emphasis            |

Avoid 400-weight grey text at small sizes. It appears weak and reduces confidence.

### 7.3 Type scale

| Role        | Desktop                        | Mobile          | Line height | Tracking   |
| ----------- | ------------------------------ | --------------- | ----------- | ---------- |
| Display XL  | `clamp(3.5rem, 5.6vw, 5.4rem)` | `3rem–4.2rem`   | `0.95`      | `-0.074em` |
| Display L   | `2.75rem–4rem`                 | `2.4rem–3rem`   | `1`         | `-0.06em`  |
| Heading 1   | `2.25rem–3.25rem`              | `2rem–2.6rem`   | `1.05`      | `-0.05em`  |
| Heading 2   | `1.65rem–2.3rem`               | `1.5rem–2rem`   | `1.1`       | `-0.04em`  |
| Heading 3   | `1rem–1.35rem`                 | `1rem–1.2rem`   | `1.25`      | `-0.025em` |
| Body L      | `1rem–1.15rem`                 | `1rem`          | `1.6–1.7`   | Normal     |
| Body        | `0.875rem–1rem`                | `0.875rem–1rem` | `1.55–1.7`  | Normal     |
| Body S      | `0.75rem–0.875rem`             | Same            | `1.5–1.65`  | Normal     |
| Label       | `0.7rem–0.8rem`                | Same            | `1.35`      | Normal     |
| Eyebrow     | `0.7rem`                       | Same            | `1.3`       | `0.14em`   |
| Micro label | `0.62rem`                      | Same            | `1.3`       | `0.1em`    |

### 7.4 Typography rules

- Use sentence case for headings, buttons, tabs, and form labels.
- Reserve uppercase for eyebrows, micro labels, and short status identifiers.
- Keep marketing headings between 8 and 14 words.
- Keep paragraph width between 45 and 70 characters where possible.
- Use tabular numerals for estimates, claim amounts, dates, and operational tables.
- Use the Indian numbering system and rupee symbol for customer-facing amounts: `₹54,800`.
- Use ranges when values are approximate: `₹48k–₹56k`.
- Do not use full stops at the end of button labels, navigation labels, or field labels.

## 8. Logo system

### 8.1 Logo meaning

The Kokki mark combines a `K`, a route, and a destination signal. It represents guided movement from accident to repaired vehicle.

### 8.2 Approved variants

- Primary: dark tile, white stem, accent route, dark wordmark
- Inverse footer variant: accent tile with dark paths and white wordmark
- Compact mark: symbol without wordmark for favicons, compact navigation, and app icons
- Monochrome: only when production constraints prevent the approved color variants

### 8.3 Clear space

Maintain clear space equal to at least one-quarter of the mark width on every side. No text, border, icon, or crop may enter this area.

### 8.4 Minimum sizes

- Full digital logo: minimum mark height `32px`
- Compact mark: minimum size `24px × 24px`
- Current header mark: `40.8px`
- Current mobile mark: `36.8px`

### 8.5 Logo restrictions

Do not:

- Stretch, rotate, skew, or redraw the mark
- Change individual route colors
- Add an outline or drop shadow
- Place the primary logo on a busy photograph
- Replace the wordmark with another font treatment
- Put the logo inside an additional container shape
- Use the mark as a decorative pattern

## 9. Iconography

Kokki uses simple outline icons with rounded caps and joins.

Standard web icon properties:

- View box: `24 × 24`
- Stroke width: approximately `1.7`
- Default sizes: `16px`, `18px`, `20px`, `24px`
- Decorative feature icon container: `40–56px`
- Button icons: `17–19px`

Rules:

- Icons must support text, not replace unclear text.
- Use one icon style within a product.
- Do not mix filled, outlined, 3D, and photographic icons.
- Always provide an accessible label when an icon is the only control content.
- Directional arrows must match the interaction direction.
- Status icons must be paired with text or another non-color signal.

## 10. Photography and illustration

### 10.1 Photography direction

Vehicle photography should feel like premium automotive editorial work:

- Neutral or warm studio environments
- Realistic, repairable damage
- Clear visibility of the relevant vehicle area
- Natural materials and believable geometry
- Calm lighting and restrained shadows
- Unbranded or properly licensed vehicles
- Space for responsive cropping when used in layouts

### 10.2 Damage imagery

Show shallow dents, scrapes, panel damage, windshield damage, or repairable collision impact. Avoid severe wreckage, injury, emergency scenes, smoke, blood, or imagery that increases anxiety.

### 10.3 UI overlays on photography

Use at most one primary overlay and one supporting marker. UI overlays must explain a real Kokki outcome, such as:

- Damage identified
- Estimated repair range
- Expected insurance coverage
- Approximate customer payable
- Expert review complete

Do not stack several floating cards around a photograph.

### 10.4 Illustration

Use code-native SVG illustration for diagrams, workflows, icons, and product explanations. Use raster imagery for editorial photography and realistic vehicle scenes.

## 11. Spacing system

Kokki uses a 4px base unit.

| Token        | Value   | Common use                   |
| ------------ | ------- | ---------------------------- |
| `--space-1`  | `4px`   | Micro adjustments            |
| `--space-2`  | `8px`   | Icon gaps and compact stacks |
| `--space-3`  | `12px`  | Field and badge gaps         |
| `--space-4`  | `16px`  | Default internal spacing     |
| `--space-5`  | `20px`  | Card groups                  |
| `--space-6`  | `24px`  | Standard layout gap          |
| `--space-8`  | `32px`  | Section groups               |
| `--space-10` | `40px`  | Large component separation   |
| `--space-12` | `48px`  | Major block separation       |
| `--space-16` | `64px`  | Section spacing              |
| `--space-20` | `80px`  | Large marketing rhythm       |
| `--space-24` | `96px`  | Rare large canvas spacing    |
| `--space-28` | `112px` | Rare display use             |
| `--space-32` | `128px` | Maximum display use          |

Rules:

- Prefer token values over arbitrary margins.
- Use smaller gaps inside a component and larger gaps between components.
- Avoid several consecutive empty areas larger than `64px`.
- A standard laptop viewport should reveal the main heading, context, and primary action without unnecessary scrolling.

## 12. Radius, borders, and elevation

### 12.1 Radius

| Token           | Value   | Usage                              |
| --------------- | ------- | ---------------------------------- |
| `--radius-xs`   | `8px`   | Small media and compact controls   |
| `--radius-sm`   | `12px`  | Inputs and compact cards           |
| `--radius-md`   | `16px`  | Standard cards and icon containers |
| `--radius-lg`   | `24px`  | Large cards and drop zones         |
| `--radius-xl`   | `32px`  | Hero and major panels              |
| `--radius-pill` | `999px` | Buttons, tags, status chips        |

Use one dominant radius family within a component. Avoid nested rounded rectangles with nearly identical borders; for example, a phone input must not look like one text field placed inside another.

### 12.2 Borders

- Default light border: `1px solid var(--color-line)`
- Dark surface border: `1px solid var(--color-line-dark)`
- Selected control: dark border plus dark or accent fill
- Upload area: `1px dashed` only when drag-and-drop is supported
- Section boundary: a background change, full-width transition, or intentional border—not an isolated decorative line

### 12.3 Shadows

| Token           | Value                              | Usage                |
| --------------- | ---------------------------------- | -------------------- |
| `--shadow-soft` | `0 18px 60px rgb(21 24 20 / 8%)`   | Standard raised card |
| `--shadow-card` | `0 34px 100px rgb(21 24 20 / 12%)` | Hero or major modal  |

Shadows should indicate elevation, not decoration. Do not combine a heavy border, heavy shadow, and strong background contrast on the same component.

## 13. Layout system

### 13.1 Container

- Standard marketing container: `1200px` maximum
- Desktop gutter: `24px` minimum
- Mobile gutter: `12px` minimum, preferably `16px` for new modules
- Center the container with auto inline margins

Current implementation:

```css
.container {
  width: min(calc(100% - 3rem), 75rem);
  margin-inline: auto;
}
```

### 13.2 Grid

- Marketing: 12-column conceptual grid
- Forms: content column plus optional sticky context rail
- Dashboards: fixed or collapsible navigation plus fluid workspace
- Use CSS Grid for page structure and Flexbox for one-dimensional component alignment
- Avoid fixed pixel widths for main content regions

### 13.3 Breakpoints

Breakpoints respond to content rather than device names.

| Name      | Width            | Typical change                           |
| --------- | ---------------- | ---------------------------------------- |
| Compact   | `35rem / 560px`  | Logo and footer simplification           |
| Small     | `40rem / 640px`  | Single-column cards and forms            |
| Medium    | `52rem / 832px`  | Hero and split-section stacking          |
| Large     | `58rem / 928px`  | Desktop navigation and form context rail |
| Wide      | `64rem / 1024px` | Four-column layouts and wide data views  |
| Container | `75rem / 1200px` | Maximum marketing content width          |

Do not add a breakpoint for one isolated alignment issue. Fix intrinsic layout behavior first.

### 13.4 Page density modes

#### Marketing

- Expressive typography
- Strong visual hierarchy
- Section padding generally `52–72px`
- One message and one action per section
- Alternating visual treatments to create clear section boundaries

#### Customer workflow

- Focused headings and plain instructions
- One-column input flow by default
- Sticky context or progress rail on desktop
- Natural page-level scrolling
- No nested scrolling for ordinary forms
- Persistent progress and clear Back/Continue actions

#### Operational workspace

- Compact typography and spacing
- Higher information density
- Tables, filters, status, and timestamps prioritized
- Optional persistent sidebar and sticky table headers
- Internal scrolling allowed only inside clearly bounded data regions such as a table viewport, not inside the entire page

### 13.5 Section rhythm and differentiation

Adjacent marketing sections must not look like one continuous section unless that continuity is intentional.

Use at least two of these signals at a major section boundary:

- Background color change
- Layout direction change
- Full-width transition rail
- Dark versus light surface
- Typography alignment change
- Distinct content pattern, such as cards versus indexed rows
- Strong top border or accent marker

Avoid repeating a centered heading followed by four cards in consecutive sections.

### 13.6 Scrolling behavior

- Use document-level scrolling for customer forms and standard pages.
- Sticky context rails may remain visible while the main form moves with the page.
- Do not lock the viewport for content that may grow due to validation, localization, accessibility text sizing, or uploaded-file previews.
- Nested scroll areas are reserved for data tables, maps, code views, and deliberately bounded workspaces.
- When a multi-step form changes step, return the document to the form start.
- Sticky headers must not cover anchored content; use `scroll-padding-top`.

## 14. Core components

### 14.1 Buttons

Variants:

| Variant     | Purpose                                                      |
| ----------- | ------------------------------------------------------------ |
| Accent      | Highest-priority conversion action on light or dark surfaces |
| Dark        | Primary transactional action on light surfaces               |
| Outline     | Secondary action                                             |
| Text        | Low-emphasis navigation or explanation                       |
| Destructive | Confirmed destructive action only                            |

Sizing:

- Default minimum height: `54px`
- Compact minimum height: `46px`
- Mobile critical actions: minimum `48px`, preferably full width
- Minimum pointer target: `44px × 44px`

Button labels should start with a verb and describe the result:

- Get Free Repair Estimate
- Continue
- Review Request
- Submit Assessment Request
- Upload Damage Photos
- Return to Homepage

Avoid vague labels such as Submit, Click Here, Proceed, or Learn More when a clearer action is possible.

### 14.2 Links

- Use links for navigation and buttons for actions.
- Inline links must be visually distinguishable without relying only on color.
- External links may use an up-right arrow.
- Forward workflow actions use a right arrow.
- Back actions use text or a left arrow.

### 14.3 Cards

Use cards only when content is meaningfully grouped or elevated.

Card hierarchy:

- Surface card: white background, light border, little or no shadow
- Raised card: white background, soft shadow
- Inverse card: dark background, light text, dark border
- Highlight card: accent background with dark text, used sparingly

Do not place every piece of content inside a card. Editorial lists, dividers, and open layouts often create a more premium result.

### 14.4 Badges and status chips

- Use short labels of one to three words.
- Pair color with text and, when important, an icon.
- Do not use bright green for neutral metadata.
- Use pill shapes for compact status only, not paragraphs or large actions.

### 14.5 Navigation

- Keep primary marketing navigation to five or fewer top-level items.
- Place the primary CTA at the end of desktop navigation.
- On mobile, use a clearly labeled menu control and a full-width CTA.
- Highlight the current application area in product navigation.
- Product portals should preserve access to support, account, notifications, and sign out.

### 14.6 Accordions

- Use accordions for optional supporting information, not required instructions.
- Make the complete summary row clickable.
- Show a visible expand/collapse icon.
- Preserve heading semantics inside accordion labels.
- Do not place form inputs or primary CTAs inside collapsed content.

### 14.7 Tables

Operational tables must provide:

- A descriptive title
- Column headers
- Sorting where meaningful
- Search or filters for large datasets
- Empty, loading, and error states
- Row focus and hover states
- Accessible status labels
- Responsive alternatives for narrow screens

On mobile, convert complex rows into structured summary cards or allow deliberate horizontal table scrolling. Do not silently hide important columns.

### 14.8 Modals, drawers, and dialogs

- Use a modal for short, blocking decisions.
- Use a drawer for contextual details that should preserve the underlying workspace.
- Use a full page for complex forms, document review, or workflows longer than one decision.
- Always provide a visible title and close action.
- Trap focus inside an open modal and return focus to the triggering control.
- Destructive confirmation must name the object and consequence.

### 14.9 Notifications and feedback

Use:

- Inline validation for field-specific problems
- Banners for page-level blockers
- Toasts for non-blocking confirmations
- Progress indicators for uploads and long-running operations
- Skeletons for predictable loading structures

Do not use a toast as the only record of a critical failure.

## 15. Forms and assessment workflows

### 15.1 Form structure

- Use one clear task per step.
- Keep customer assessment forms single-column by default.
- Pair fields only when they are short, closely related, and remain readable.
- Show step number, step name, and progress.
- Place Back and Continue after the current step content.
- Preserve entered information when users move between steps.
- Use progressive disclosure for conditional questions.

### 15.2 Labels and help text

- Every control requires a persistent visible label.
- Placeholder text is an example, not a label.
- Place helper text below the control.
- Explain why sensitive or unusual information is needed.
- Mark optional fields with “Optional”; do not mark every required field.
- Keep instructions close to the control they describe.

### 15.3 Input anatomy

Standard inputs contain:

1. Label
2. Optional supporting instruction
3. One visible control boundary
4. Optional helper text
5. Validation message when needed

Default input height is `56–58px` for customer workflows. Compact operational inputs may use `40–48px`.

### 15.4 Phone field

The country prefix and number are one composite control.

```text
┌─────────────────────────────────────────────┐
│ +91 │ 98765 43210                           │
└─────────────────────────────────────────────┘
```

Rules:

- Use one outer border and one focus ring.
- Separate the prefix with a single internal divider.
- Do not draw another border or background around the inner number input.
- Support country selection when Kokki expands beyond one country.
- Use `type="tel"`, `inputmode="numeric"`, and appropriate autocomplete.

### 15.5 Choice controls

- Use radio buttons for one choice from a set.
- Use checkboxes for independent choices or consent.
- A segmented radio treatment is acceptable for short sets such as Yes, No, Not sure.
- Selected controls must have text, border, and fill changes—not color alone.

### 15.6 File upload

Damage photo upload should communicate:

- Minimum and maximum number of images
- Supported formats
- Maximum file size
- Required full-vehicle image
- Required close-ups of every damaged area
- Upload progress and per-file errors
- Thumbnail preview and remove action

Policy upload should support PDF and common image formats. Secure handling and retention information must be available near the upload or privacy explanation.

### 15.7 Validation

- Validate after meaningful interaction, on blur, or on Continue—not while the user is typing the first character.
- Place field errors directly below the affected control.
- Move focus to the first invalid field after submission.
- Page-level errors should summarize the problem and point to recovery.
- Preserve user input after an error.
- Error messages must state how to fix the issue.

Good: “Enter a valid 10-digit WhatsApp number.”  
Avoid: “Invalid input.”

### 15.8 Consent

Consent must be explicit, unchecked by default, and written in plain language. Separate service consent from optional marketing consent when both exist.

### 15.9 Review and confirmation

Before submission, show a structured summary with Edit actions. After submission, show:

- Confirmation that the request was received
- Request ID
- Vehicle number
- Contact number
- Submission date and time
- Expected response window
- What happens next
- Initial-assessment disclaimer

## 16. Workflow and status language

Use a consistent customer-facing lifecycle:

1. Request started
2. Details submitted
3. Expert review
4. Estimate shared
5. Garage selected
6. Vehicle received
7. Survey scheduled
8. Insurer approval pending
9. Repair in progress
10. Quality check
11. Ready for delivery
12. Completed

Internal systems may use more granular states, but every internal state must map to one clear customer state.

Status copy should answer:

- What is happening?
- Who is responsible now?
- Is customer action required?
- When should the next update occur?

## 17. Motion and interaction

### 17.1 Motion tokens

| Token                 | Value                                  | Use                                |
| --------------------- | -------------------------------------- | ---------------------------------- |
| `--transition-fast`   | `160ms ease`                           | Color, border, icon movement       |
| Standard interaction  | `250ms ease-out`                       | Card hover and compact reveal      |
| `--transition-smooth` | `320ms cubic-bezier(0.22, 1, 0.36, 1)` | Larger layout or transform changes |

### 17.2 Motion rules

- Motion must explain hierarchy, feedback, or spatial change.
- Hover lift should not exceed `4px` for standard cards.
- Avoid continuous decorative animation in task flows.
- Do not animate layout in a way that moves the user’s target.
- Loading indicators must communicate progress without implying a false duration.
- Respect `prefers-reduced-motion` and reduce non-essential animation to near zero.

### 17.3 Interaction states

Every interactive component requires:

- Default
- Hover, when a hover-capable pointer exists
- Focus-visible
- Active/pressed
- Disabled
- Loading, when applicable
- Error or invalid, when applicable

Hover must never be the only way to reveal essential information.

## 18. Accessibility

Kokki targets WCAG 2.2 AA.

### 18.1 Required standards

- Text contrast: at least `4.5:1` for normal text
- Large text contrast: at least `3:1`
- UI component and focus indicator contrast: at least `3:1`
- Minimum pointer target: `44px × 44px` where practical
- Visible keyboard focus for every interactive element
- Logical source and tab order
- Semantic headings without skipped hierarchy
- Labels programmatically associated with fields
- Error messages connected with `aria-describedby`
- Live regions for asynchronous status when necessary
- Meaningful image alt text; decorative images use empty alt text
- Dialog focus management
- Reduced-motion support
- Layout remains usable at 200% zoom
- Content reflows without loss at a `320px` viewport

### 18.2 Language and comprehension

- Prefer common words over insurance or repair jargon.
- Explain technical terms at first use.
- Keep instructions short and actionable.
- Do not make important information dependent on icons.
- Give users enough time to read and complete a task.

### 18.3 Accessibility QA

Every release must be tested with:

- Keyboard only
- Browser zoom at 200%
- Reduced-motion preference
- At least one screen reader on a supported platform
- Automated accessibility tooling
- High-contrast inspection for important states

## 19. Content design

### 19.1 Voice

Kokki speaks like a calm, knowledgeable claim expert.

Use:

- “Upload clear photos of every damaged area.”
- “A Kokki expert will review your request.”
- “Expected insurance coverage”
- “Approximate customer payable”
- “Here’s what happens next.”

Avoid:

- “Instant guaranteed claim approval”
- “Don’t panic!”
- “Your claim has been approved” before insurer approval
- “Best garage” without evidence
- Unexplained abbreviations and internal status codes

### 19.2 Terminology

| Preferred                    | Avoid                | Reason                                              |
| ---------------------------- | -------------------- | --------------------------------------------------- |
| Damage assessment            | Claim submission     | Kokki is not submitting the claim at the first step |
| Initial repair estimate      | Final quote          | The amount may change                               |
| Expected insurance coverage  | Guaranteed coverage  | Insurer approval is external                        |
| Approximate customer payable | Final amount due     | Final inspection may change it                      |
| Kokki expert                 | Executive or agent   | Warmer and clearer for customers                    |
| Certified garage network     | Vendor ecosystem     | Customer-facing clarity                             |
| Vehicle owner                | User, party, insured | Human language                                      |

### 19.3 CTA hierarchy

Primary acquisition CTA:

> Get Free Repair Estimate

Assessment submission CTA:

> Submit Assessment Request

Do not change the same action’s label across nearby sections unless the action itself changes.

### 19.4 Legal and estimate language

Use this baseline disclaimer wherever an initial estimate or insurance projection is shown:

> Repair cost, expected insurance coverage, claim amount, and customer payable shown during the initial assessment are approximate. Final amounts may change after physical vehicle inspection, garage evaluation, insurance survey, policy verification, and insurer approval.

Legal copy must remain readable. Do not reduce it below `12px` or use low-contrast grey.

### 19.5 Dates, time, and numbers

- Customer date: `5 Aug 2026`
- Detailed date and time: `5 Aug 2026, 4:30 PM`
- Currency: `₹54,800`
- Estimate range: `₹48k–₹56k`
- Phone: `+91 98765 43210`
- Vehicle number: uppercase with spaces, for example `MH 15 AB 1234`
- PIN code: six digits

## 20. Responsive behavior

### 20.1 Mobile

- Use a single content column.
- Keep primary actions full width when space is limited.
- Show compact progress instead of a desktop side rail.
- Use native camera/file capabilities for image uploads.
- Avoid sticky elements that consume excessive vertical space.
- Keep important labels visible when the keyboard is open.

### 20.2 Tablet

- Use two-column card grids where content permits.
- Stack major split layouts before either column becomes cramped.
- Do not preserve desktop navigation at the expense of tap spacing.

### 20.3 Desktop

- Keep key hero content and primary CTA visible within a standard 13-inch laptop viewport.
- Use sticky side context for long workflows while allowing the document to scroll.
- Do not stretch paragraphs or forms across the full screen width.
- Use extra width to improve hierarchy, not to add unnecessary content.

### 20.4 Long and dynamic content

Design for:

- Validation messages
- Long vehicle models and garage names
- Uploaded-file lists
- Translated content
- Browser text scaling
- Empty, partial, and failed states
- Large currency amounts

Never enforce a fixed-height card when its content can grow.

## 21. Trust, privacy, and safety patterns

Kokki handles accident images, contact information, vehicle identifiers, and insurance documents. Trust must be visible at the moment data is requested.

Interfaces should explain:

- Why information is needed
- Who reviews it
- How the customer will be contacted
- Whether a field is optional
- How documents are handled
- What is and is not guaranteed

Use a shield icon only when the surrounding copy names the actual protection or handling practice. Do not use security imagery as unsupported decoration.

Operational applications must protect sensitive information through role-based access, audit logs, appropriate masking, secure storage, and session management. These are product requirements, not visual substitutes.

## 22. Platform-specific application

### 22.1 Marketing website

- Lead with the pre-garage value proposition.
- Show the real customer journey, not internal stakeholder architecture.
- Use premium vehicle imagery and product-specific estimate information.
- Follow major feature sections with trust evidence.
- Clearly separate adjacent sections with different visual patterns.

### 22.2 Customer assessment and tracking

- Prioritize the current task and progress.
- Use one-column fields and page-level scrolling.
- Keep the desktop progress/context rail sticky.
- Show human review, next steps, and response expectations.
- Keep disclaimers close to estimates and submission.

### 22.3 Garage portal

- Prioritize job scope, vehicle details, estimate line items, approval state, and deadlines.
- Make document and photo comparison easy.
- Separate Kokki instruction, insurer approval, and garage action.
- Track revisions and preserve an audit trail.

### 22.4 Surveyor and insurer modules

- Prioritize evidence, policy data, estimate differences, decisions, and timestamps.
- Use structured tables and side-by-side comparison where appropriate.
- Clearly mark source, author, and revision date.
- Never mix indicative Kokki estimates with approved insurer values.

### 22.5 Kokki operations tools

- Optimize for queue management, exceptions, ownership, and response time.
- Support keyboard navigation and bulk actions where safe.
- Use compact density without reducing readability.
- Show the customer-facing status alongside detailed internal status.

## 23. Engineering standards

### 23.1 Token use

- Use CSS custom properties for shared visual values.
- Do not introduce repeated raw hex colors in component files.
- Add a semantic token when a value represents a reusable purpose.
- Keep brand primitives centralized.

### 23.2 Component structure

- Place shared primitives in `components/ui`.
- Place shared brand components in `components/brand`.
- Place application-shell components in `components/layout`.
- Keep domain-specific components close to their product module.
- Prefer composition over large components with many boolean props.

### 23.3 CSS conventions

- Use descriptive, component-scoped class names.
- The current web implementation follows a BEM-like structure: `component`, `component__element`, `component--modifier`.
- Use logical properties such as `margin-inline` and `padding-block` where practical.
- Use `clamp()` for fluid display typography and section spacing.
- Keep media queries near the related page stylesheet or component layer.
- Avoid `!important`.
- Avoid styling by DOM depth when a stable class is clearer.

### 23.4 React conventions

- Use semantic HTML before adding ARIA.
- Keep controlled form state predictable.
- Give list items stable keys.
- Clean up object URLs and subscriptions.
- Preserve user input between workflow steps.
- Separate validation, state transition, and submission logic.
- Include loading, error, empty, and success behavior in the component contract.

### 23.5 Asset standards

- Prefer SVG for logos and icons.
- Use optimized JPEG, WebP, or AVIF for photography.
- Provide responsive image sizes for large production images.
- Avoid embedding text inside raster images.
- Record the source and usage rights for every production asset.
- Keep customer-uploaded images out of the static application bundle.

### 23.6 Performance

Targets for customer-facing pages:

- Largest Contentful Paint under 2.5 seconds at the 75th percentile
- Interaction to Next Paint under 200 milliseconds
- Cumulative Layout Shift under 0.1
- Initial critical route JavaScript kept intentionally small
- Hero image optimized and sized to its rendered context
- Non-critical images lazy-loaded

## 24. Component readiness checklist

A shared component is ready when it has:

- A clear purpose and documented usage
- Token-based styling
- All interaction states
- Keyboard behavior
- Accessible name and semantics
- Responsive behavior
- Long-content behavior
- Error and loading behavior where applicable
- Reduced-motion behavior where applicable
- Visual tests or screenshots for major variants
- Unit or interaction tests for important behavior

## 25. Screen quality checklist

Before a screen is approved, verify:

### Product clarity

- Is the screen’s purpose understandable within five seconds?
- Is the next action clear?
- Are estimates and approvals accurately described?
- Does the user know who acts next?

### Visual quality

- Is there one dominant focal point?
- Are adjacent sections visually distinct?
- Is accent green used intentionally?
- Are spacing and type values token-based?
- Does the screen avoid repeated card patterns?

### Workflow

- Is progress visible?
- Is entered information preserved?
- Are Back, Continue, Edit, and Submit actions predictable?
- Does the page scroll naturally without accidental nested scrolling?
- Are dynamic errors and uploaded files handled without breaking layout?

### Accessibility

- Is keyboard navigation complete?
- Is focus visible?
- Do all controls have labels?
- Is contrast sufficient?
- Does the screen work at 200% zoom and `320px` width?
- Is reduced motion respected?

### Content

- Is language plain and calm?
- Are CTAs specific?
- Are dates, currency, phone numbers, and vehicle numbers formatted consistently?
- Are disclaimers present and readable where required?

### Engineering

- Does linting pass?
- Does formatting pass?
- Does the production build pass?
- Are assets optimized?
- Are loading, empty, error, and success states implemented?

## 26. Anti-patterns

Avoid these recurring mistakes:

- Oversized sections that hide the primary CTA below the first viewport
- Consecutive sections with the same centered-heading-and-card-grid composition
- Generic dashboard mockups that do not communicate Kokki’s product value
- Several overlapping floating cards around a hero image
- Grey paragraph text with insufficient contrast
- Large empty spaces used as a substitute for hierarchy
- Internal stakeholder diagrams presented as customer journeys
- Nested scrollbars in ordinary customer forms
- Phone inputs that visually appear as two fields
- Sticky panels that obscure content or cannot fit at common laptop heights
- Guaranteed language for estimates or insurance outcomes
- Decorative trust badges without verifiable meaning
- Multiple equally prominent CTAs
- Fixed-height containers for dynamic content

## 27. Governance

### 27.1 Ownership

The design-system owner is responsible for:

- Approving new tokens and core component variants
- Maintaining this document
- Reviewing accessibility and cross-product consistency
- Coordinating implementation changes across applications

### 27.2 Contribution process

When a team needs a new pattern:

1. Confirm an existing component cannot satisfy the requirement through composition.
2. Document the user need and affected products.
3. Define anatomy, variants, states, responsive behavior, and accessibility.
4. Add or update tokens before adding local constants.
5. Implement and test the component in one product.
6. Review it across customer, partner, and operations contexts.
7. Update this guide and publish a version note.

### 27.3 Versioning

- Patch: clarification or non-breaking visual adjustment
- Minor: new component, token, or backward-compatible variant
- Major: breaking token changes, brand redesign, or component API changes

Deprecations must include a replacement and migration window.

### 27.4 Exception policy

Exceptions must document:

- The user or business reason
- Why an existing pattern is insufficient
- Accessibility impact
- Products affected
- Whether the exception should become a shared pattern
- Expiry or review date

## 28. Quick reference

### Brand essentials

- Typeface: Manrope Variable
- Ink: `#151814`
- Dark: `#121612`
- Accent: `#d0fa62`
- Paper: `#f4f4ed`
- Surface: `#fbfcf8`
- Standard container: `1200px`
- Base spacing unit: `4px`
- Standard input height: `56–58px`
- Standard button height: `54px`
- Minimum target: `44px`
- Accessibility target: WCAG 2.2 AA

### Product language essentials

- Say “initial repair estimate,” not “final quote.”
- Say “expected insurance coverage,” not “guaranteed coverage.”
- Say “Submit Assessment Request,” not “Submit Claim.”
- Make human expert review visible.
- State what happens next.

### Layout essentials

- One primary action per visual region
- One-column customer forms by default
- Natural page-level scrolling
- Sticky desktop context rail when useful
- Clear visual division between adjacent marketing sections
- No unnecessary fixed heights
- No nested scrolling for standard forms

---

This document should evolve with Kokki’s products while preserving the central experience: clear guidance, transparent expectations, and calm expert coordination from damage assessment to repaired vehicle.
