# About Me Page Redesign Plan

## 1. Context

Redesign the About Me page to create a more engaging, story-driven experience that showcases Felipe's global upbringing, engineering journey, and personal interests. The page will maintain the existing interactive timeline while adding new modular sections with text and images. The goal is to create an aesthetic, easy-to-read page that flows naturally from past experiences to present interests and future aspirations.

---

## 2. Website Design Philosophy

Following established design principles:

- **Clarity & Readability**: Clean typography hierarchy with clear section breaks and logical content flow
- **Modern Aesthetic**: Sleek, minimal design with subtle shadows, rounded corners, and generous whitespace
- **Consistency**: Reuse existing color scheme, typography, and component patterns from the current site
- **Responsiveness**: Ensure all new sections adapt gracefully across mobile, tablet, and desktop
- **Modularity**: Create reusable section components that can be easily expanded or reordered
- **Performance**: Optimize images and maintain smooth scrolling/animations
- **Accessibility**: Semantic HTML structure with proper alt text and keyboard navigation

---

## 3. Relevant Files & Code Areas

### HTML Files

- **`about_me.html`** (lines 47-504) → Complete restructure of main content sections while preserving timeline (lines 81-446)

### CSS Files

- **`src/css/pages.css`** (lines 8-163) → Update existing about page styles and add new section styles
- **`src/css/components.css`** (lines 1-168) → Add new component styles for hobbies grid and quote sections
- **`src/css/variables.css`** → Ensure color consistency across new sections

### JavaScript Files

- **`src/js/main.js`** → Add any new interactive behaviors for hobbies grid hover effects
- **`src/js/life-timeline.js`** → Keep existing timeline functionality unchanged

### Assets

- **`assets/`** → Add new images for hobbies section (sports activities). Add pseudo images where it would aid the website design. I'll choose the images later
- **`assets/maplived+visited.png`** → Reuse existing travel map image

---

## 4. Layout & Interaction Logic

### Page Structure Flow

1. **Page Banner**: "My Past, Present & Future" as full-width page header with subtitle
2. **A World of Adventures**: Text section with supporting image + call-to-action for timeline
3. **Existing Timeline**: Preserve exactly as-is (lines 81-446 in current HTML)
4. **The Gift of a Global Childhood**: Text with large clickable map positioned at bottom right
5. **Curiosity, Technology and Futurism**: Diagonal layout with paragraphs and quotes strategically positioned
6. **Hobbies and Adventures**: Interactive 4x4 grid with hover effects showing activity names
7. **Books and Podcasts**: Simple link section to external page with engaging button design

### Image Placement Strategy

#### Hero Section

- **Image**: Personal headshot or engineering-related image (`headshot_felipe1.jpg` or `fusion_energy.jpg`)
- **Layout**: Full-width background image with text overlay, or side-by-side layout
- **Purpose**: Establish personal connection and professional identity

#### World of Experiences Section

- **Image**: Global/cultural imagery (`sydney_skyline.jpg`)
- **Layout**: Split layout with image on right, text on left
- **Purpose**: Visual representation of global upbringing

#### Gift of Global Childhood Section

- **Primary Image**: Travel map (`maplived+visited.png`) - already planned - make this map big. Make it clickable so if clicked on it becomes large.
- **Layout**: Two-column with text and map, plus smaller supporting image
- **Purpose**: Reinforce global experience narrative

#### Curiosity & Futurism Section

- **Primary Images**:
  - Engineering/science image (`3d_printing.jpg` or `fusion_energy.jpg`)
  - Technology/future image (`futuretech.png` or `ITER-Fusion-Reactor.gif`)
- **Layout**: Text with side quote panel, plus supporting images interspersed
- **Purpose**: Visual representation of technical interests and futurism

#### Hobbies Section

- **Images**: 16 activity-specific images in grid layout
- **Layout**: 4x4 responsive grid with hover effects
- **Purpose**: Showcase diverse interests and activities

### Responsive Behavior

- **Desktop (>980px)**: Two-column layouts for text/image sections, 4-column hobbies grid
- **Tablet (640-980px)**: Single-column stacking, 3-column hobbies grid
- **Mobile (<640px)**: Single-column layout, 2-column hobbies grid

### Interactive Elements & Smooth Navigation

- **Hobbies Grid**: Hover effects that darken image and overlay activity name
- **Quote Section**: Side panel that complements main text content
- **Smooth Scrolling**: Enhanced smooth scroll behavior between sections with scroll indicators
- **Image Animations**: Subtle fade-in animations as images enter viewport
- **Navigation Enhancement**:
  - Sticky navigation with section indicators
  - Smooth scroll-to-section functionality
  - Progress indicator showing page scroll position
- **Loading States**: Progressive image loading with placeholder states

---

## 5. Phases

### Phase 1 – HTML Structure

- Replace existing content sections (lines 47-80, 447-504) with new modular sections
- Preserve timeline section exactly (lines 81-446)
- Add semantic HTML structure for all new content areas
- Include all provided content text and placeholder comments for images

### Phase 2A – CSS Styling

- Update `pages.css` with new about page section styles
- Add hobbies grid styles to `components.css`
- Create quote panel and two-column layout styles
- Add image layout styles for hero, split, and supporting image sections
- Implement smooth scroll and animation styles
- Ensure responsive breakpoints match existing site patterns

### Phase 2B – Interactive Features

- Add JavaScript for hobbies grid hover effects
- Implement smooth scroll-to-section functionality
- Add scroll progress indicator
- Create image lazy loading and fade-in animations
- Add navigation enhancement features
- Test accessibility and keyboard navigation

### Phase 3 – Content Integration

- Add all supporting images to text-heavy sections
- Optimize image loading with progressive enhancement
- Add proper alt text for all images
- Implement image placeholder states
- Final responsive testing across devices

---

## 6. New Content Sections (Exact Text to Include)

### Hero Section

**Title**: "My Past, Present & Future"
**Subtitle**: "On paper, I'm an Integrated Engineer but what really defines me is my upbringing, my curiosity and my drive for constant growth."
**Supporting Image**: Personal headshot or engineering imagery to establish connection

### World of Experiences Section

**Title**: "A World of Experiences"
**Content**: "I spent my childhood moving around the world, living about three years in each country as my dad's work took our family across the globe. It wasn't always easy, but looking back, I'm incredibly grateful for it. Each move exposed me to different cultures, pushed me outside my comfort zone, and taught me how to adapt quickly.

Scroll the timeline below to find out more!"
**Supporting Image**: Global/cultural imagery to visually represent the international experience

### Gift of Global Childhood Section

**Title**: "The Gift of a Global Childhood"
**Content**: "At first, moving from country to country felt like starting over again and again - leaving friends, routines, and familiarity behind. But over time I realized those experiences shaped me into who I am today.

Constant change taught me resilience and gave me a growth mindset; I learned that the biggest challenges often bring the most growth. Each move proved that no matter how daunting something seems at the start, if you commit yourself fully, you can adapt, succeed, and thrive. That lesson instilled in me the belief that you can achieve anything you set your mind to.

Being immersed in so many cultures gave me a strong sense of global citizenship, empathy, and adaptability. Every new school, team, and community forced me to step forward, build connections, and develop social skills that still serve me today.

Sports and group activities honed my leadership and communication, while travel broadened my perspective on what's possible in life. I came to see diversity as something to celebrate and learn from.

In short, this unique childhood instilled in me resilience, adaptability, and a growth mindset - strengths I carry into every challenge I take on today."
**Primary Image**: Travel map (`maplived+visited.png`)
**Secondary Image**: Cultural/adaptation imagery to reinforce the narrative

### Curiosity & Futurism Section

**Title**: "Curiosity, Technology and Futurism"
**Content**: "My curiosity was first sparked by my grandfather. Every Christmas in Colombia, he would set up fun science experiments and explain the physics behind them. He was a curious engineer with an endless appetite for knowledge, and to this day he remains one of my greatest role models - alongside my father.

My father's work in the oil and gas industry was the reason my family moved so often, yet he was also the first to encourage my early interest in renewable energy. He told me it was the future, and that oil and gas would one day disappear. Growing up in a time when climate change was the defining global challenge, I developed a deep interest in green energy that later grew into a broader fascination with clean technology and innovation as a whole.

Curiosity for emerging technologies sparked my path, and engineering followed as the tool to turn ideas into solutions and make an impact on the world's biggest challenges. Over time I've come to realize that solving these problems goes beyond engineering: it requires understanding society, economics, and policy too. (You can read more about this on my Research page.)

I consider myself a futurist. To me, being a futurist means more than speculating about what's next — it's about exploring the possibilities that lie ahead so we can make better choices today. It means staying curious about how the world works on both the micro and macro scale, and believing that technology and human creativity can change the world for the better. Most of all, it reflects my conviction that with optimism, curiosity, and focus, we can shape a future that's brighter than the present."
**Supporting Images**:

- Engineering/science imagery (`3d_printing.jpg` or `fusion_energy.jpg`)
- Technology/future imagery (`futuretech.png` or `ITER-Fusion-Reactor.gif`)

### What is a Futurist Quote Panel

**Quotes**:

- "Explorer of the future, trying to imagine the possibilities that lie ahead" - Peter Schwartz
- "A person that has unbounded curiosity about what our future may hold" - Nikolas Badminton

### Hobbies Section

**Title**: "Hobbies and Activities"
**Activities**: Soccer, backpacking, Gym, Running, skiing, snowboarding, triathlon, jet skiing, surfing, Volleyball, tennis, skydiving, scuba diving, hiking, camping

### Books & Podcasts Section

**Title**: "Books and Podcasts"
**Content**: A clickable button that will take you to an external page. Make the button cool
**Design**: Engaging call-to-action button with hover effects and smooth transitions

---

## 7. Enhanced Navigation & User Experience

### Smooth Navigation Features

- **Scroll Progress Indicator**: Visual progress bar showing page scroll position
- **Section Navigation**: Sticky navigation with section indicators
- **Smooth Scroll-to-Section**: Click navigation that smoothly scrolls to sections
- **Image Lazy Loading**: Progressive image loading with fade-in animations
- **Loading States**: Placeholder states for images while loading
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements

### Performance Optimizations

- **Image Optimization**: Responsive images with proper sizing for different devices
- **Lazy Loading**: Images load as they enter the viewport
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Progressive Enhancement**: Core functionality works without JavaScript

---

⚡ **Summary**: This enhanced plan creates a cohesive, story-driven About Me page with strategic image placement that enhances rather than distracts from the content. The design includes smooth navigation, progressive image loading, and engaging interactive elements while maintaining the existing timeline. The modular design allows for easy content updates while ensuring consistent aesthetics and responsive behavior across all devices.
