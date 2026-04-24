# Genre Analysis: Dice-Based Sokoban Puzzle Game

> Research document for **TheDiceGame** — a grid-based puzzle game where pushing dice changes their top face, and the top face determines the die's active ability.

---

## Table of Contents

1. [Mechanic Patterns](#1-mechanic-patterns)
2. [Level Design Principles](#2-level-design-principles)
3. [Dice Mechanic Deep Dive](#3-dice-mechanic-deep-dive)
4. [Surprise & Delight Moments](#4-surprise--delight-moments)
5. [MVP Scope Recommendations](#5-mvp-scope-recommendations)
6. [Risk Factors](#6-risk-factors)
7. [Sources](#7-sources)

---

## 1. Mechanic Patterns

### 1.1 Rules-as-Objects (Baba Is You)

Baba Is You's defining innovation is that the rules of the game are physically present in the world as pushable blocks. The sentence `ROCK IS PUSH` makes rocks pushable — break that sentence and the rule evaporates.

**Key design decision:** Arvi Teikari originally planned for objects to have intrinsic properties (e.g., ice melts near lava) that players could disable with `NOT`. He later concluded that objects having *no default properties* was far more interesting — an object is meaningless until a rule defines it.

**Pattern for TheDiceGame:** Our dice already embody this — a die has no inherent behavior until you read its top face. The face *is* the rule. When the die rolls, the rule changes. This is a strong foundation because the player can see and manipulate the rule through physical interaction.

### 1.2 Rolling-Until-Stopped & Orientation-Matters (A Monster's Expedition)

In A Monster's Expedition, logs are pushed and roll until they hit an obstacle. The critical insight: **the orientation of the log when it stops determines what it can do next** (fall as a bridge, form a raft, block a path). This means the *path* the log takes matters as much as the *destination*.

**Pattern for TheDiceGame:** Our dice rolling works identically — the path determines the final face. A die pushed north 3 spaces will show a different top face than one pushed east 1 space then north 2 spaces. This creates the same "orientation-matters" depth that makes A Monster's Expedition's logs so rich.

### 1.3 Irreversible State Changes (Cross-Genre Pattern)

The strongest puzzle games feature actions that permanently alter the game state:

| Game | Irreversible Action | Why It Creates Depth |
|------|---------------------|---------------------|
| Snakebird | Eating fruit lengthens body | Changes what movements are physically possible |
| Stephen's Sausage Roll | Cooking a sausage side | Can't un-cook — forces ordering decisions |
| Baba Is You | Destroying a word block | Permanently removes a possible rule |
| A Monster's Expedition | Felling a tree | Tree becomes log with new physics |

**Pattern for TheDiceGame:** The red die's explosion is our strongest irreversible mechanic — once it detonates, the blast permanently removes obstacles (and potentially other dice). This creates rich ordering puzzles: *which* die do you detonate *first*, and what state does the board need to be in when it goes off?

### 1.4 Interleaving (ExtraTricky's Framework)

From puzzle design researcher ExtraTricky: the deepest puzzles require **interleaving** — where progress on solving one element must be *interrupted* to advance another, then returned to. The solver must discover hidden dependencies between seemingly independent sub-problems.

**Pattern for TheDiceGame:** A level with two dice where you must partially position die A, then roll die B to create a path, then return to die A — this interleaving creates the richest "aha" moments. Design levels where the *order of operations* between multiple dice is the core puzzle.

### 1.5 Cross-Pattern Explosions & Chain Reactions (Bomberman)

Bomberman's explosion mechanic uses a cross (cardinal directions) blast pattern with a fixed range. When one bomb's blast hits another bomb, it detonates immediately — creating **chain reactions**. The timed fuse adds a planning dimension: players must predict the board state N turns in the future.

**Pattern for TheDiceGame:** The red die combines both concepts:
- The top face number = countdown timer (like Bomberman's fuse)
- Explosion in a cross pattern (like Bomberman's blast)
- Rolling the die *changes* the countdown — the player directly manipulates timing through spatial actions
- Chain reactions: one red die's explosion can trigger another if it's in the blast radius

This is potentially our deepest mechanic because it links spatial reasoning (where to position the die) with temporal reasoning (what the countdown will be when it reaches position).

### 1.6 Conditional Reversibility

Not all actions are fully reversible or fully irreversible — the most interesting ones are **asymmetrically difficult to reverse**. Gravity is the classic example: falling is trivial, climbing back up is hard (or impossible without specific tools).

**Pattern for TheDiceGame:** Rolling a die is conditionally reversible — you *can* roll it back, but you need to push it from the opposite side, which may not be accessible. This natural asymmetry (vs. artificial "you can't go back" rules) feels fair to the player and creates emergent constraints.

---

## 2. Level Design Principles

### 2.1 The Mandatory Discovery Method (A Monster's Expedition)

A Monster's Expedition never explains its mechanics. Instead, it uses **island geometry to force discovery**:

1. An island is shaped so there's only one thing to try
2. The player tries it (no other option exists)
3. The result teaches the mechanic
4. The next island requires the mechanic intentionally

> "When A Monster's Expedition has to introduce a whole new concept, it is very, very good at heavily hinting at what that new concept is through the shape of the island."
> — The Scientific Gamer

**For TheDiceGame:** The first level with the blue die should have only one die and one target. The grid should be shaped so pushing the die in the "wrong" direction is impossible (walls block it). The player is forced to push it the only available direction, sees it slide, and learns the mechanic.

### 2.2 Constraint-Based Teaching

The best puzzle tutorials don't *tell* — they **constrain**. By removing options until only the intended action remains, the player feels like they *discovered* the mechanic rather than being taught it.

**Progressive constraint removal:**
1. **Level 1:** One die, one wall, one target. Only one push is possible → player learns pushing.
2. **Level 2:** One die, open space, one target. Multiple pushes possible but only one sequence works → player learns rolling changes the face.
3. **Level 3:** One die where the *starting face matters*. Player must plan the roll path → player learns face-tracking.
4. **Level 4:** Two dice. Simple interaction required → player learns dice can affect each other.

### 2.3 The Island Size Principle

A Monster's Expedition keeps islands small — **maximum ~10 tiles**. This is critical:

> "The small size of the islands and the fact that you're constrained in what you can do means the solution space doesn't sprawl into incomprehensibility."

**For TheDiceGame:** Keep grids small. A 5×5 grid with 2 dice is better than an 8×8 grid with 2 dice. The smaller grid naturally constrains the solution space and makes the player feel smart for finding the answer, rather than exhausted from searching.

**Recommended grid sizes:**
- Tutorial levels: 3×3 to 4×4
- Standard levels: 5×5 to 6×6
- "Boss" levels: 7×7 (absolute maximum)

### 2.4 One Mechanic Per Level (Then Combine)

From Arvi Teikari's GDC talk: each level in Baba Is You ideally teaches or explores *one* concept. Complexity comes from *combining* previously learned concepts, not from introducing multiple new things simultaneously.

**Level progression template:**
```
Phase 1: Mechanic A alone (3-5 levels)
Phase 2: Mechanic B alone (3-5 levels)
Phase 3: A + B together (3-5 levels, increasing complexity)
Phase 4: Surprise twist that recontextualizes A or B (1-2 levels)
```

### 2.5 Patrick Traynor's Level Design Strategies

Patrick Traynor (creator of Patrick's Parabox) offers concrete techniques for generating puzzle levels:

1. **Find the lesson, build the level:** Identify one thing you want the player to learn (a rule, edge case, or technique) and design a level that teaches it.
2. **Forward design:** Start from a blank slate and place objects to create a logical chain of deductions the player must follow.
3. **The "party" exercise:** Pretend all mechanics are at a party. What happens when Mechanic A meets Mechanic B? Design a level around that encounter.
4. **The "between" technique:** Take your simplest and hardest existing puzzles. Design the level that would logically go *between* them.
5. **Variation branching:** While iterating on a puzzle, stay alert for variations that could become their own level — a slightly different setup, a twist, a harder version.

### 2.6 Pacing and Rest Levels

Not every level should be hard. The best puzzle games include "rest" levels — simpler puzzles between difficult ones that:
- Let the player feel competent after a hard level
- Reinforce a mechanic before adding complexity
- Provide a breather that prevents frustration fatigue

A Monster's Expedition achieves this naturally through its open-world structure — if a puzzle is too hard, the player simply walks to a different island.

**For TheDiceGame:** If using linear progression, include an easy level after every 2-3 hard ones. If using a branching structure (recommended), allow players to skip forward and return to hard levels later.

---

## 3. Dice Mechanic Deep Dive

### 3.1 Prior Art: Games With Dice-Face Mechanics

**Devil Dice (XI, 1998, PlayStation):** The closest predecessor. Players control a small character running atop dice on a grid. Rolling a die changes its top face. The core mechanic: group adjacent dice showing the *same* pip count, and the group size must be ≥ the pip count (e.g., three 3s, four 4s). Matched groups sink and disappear.

**Key lesson from Devil Dice:** The game demonstrates that dice-face-tracking is viable as a core mechanic, but it requires **constant visual feedback** about the current state of every die. Devil Dice solved this by showing the top face prominently and keeping the grid relatively small.

**Dicey Dungeons (2019):** Uses dice as a resource allocation mechanic rather than a spatial one, but demonstrates that dice are inherently readable game objects — players intuitively understand faces, numbers, and probability.

**A Monster's Expedition (2020):** While not using dice, the rolling log mechanic is mechanically identical to our dice rolling. Logs have orientation, and rolling changes that orientation. The game proves this mechanic supports 600+ puzzles without becoming stale.

### 3.2 The "Opposite Faces Sum to 7" Rule

Standard dice have a fixed relationship: opposite faces always sum to 7 (1↔6, 2↔5, 3↔4). This is our foundational constraint and it has important implications:

**Positive:** The rule is widely known and intuitive. Players can predict the bottom face from the top face without seeing it. This reduces hidden information anxiety.

**Negative:** Most players do *not* know which face is to the left/right/front/back of a given top face. A die has 24 possible orientations (6 faces × 4 rotations per face). Tracking the side faces is extremely difficult mentally.

**Design recommendation:** For the core mechanic (top face = ability), only the top face should matter. Never design a puzzle that requires the player to track side faces — this crosses the line from "challenging" to "tedious."

### 3.3 Rolling Physics

When a die is pushed north, the top face rotates forward and becomes the north-facing side. The south-facing side becomes the new top. Concretely:

```
Push NORTH: top → north, south → top, bottom → south, north → bottom
Push SOUTH: top → south, north → top, bottom → north, south → bottom
Push EAST:  top → east, west → top, bottom → west, east → bottom
Push WEST:  top → west, east → top, bottom → east, west → bottom
```

**Critical insight:** Pushing a die N spaces in one direction changes the top face N times. Because there are only 4 unique faces in any roll axis, the cycle repeats every 4 pushes:

```
Starting top: 1
Push 1 north: 2 on top
Push 2 north: 6 on top
Push 3 north: 5 on top
Push 4 north: 1 on top (cycle complete)
```

This creates a **modular arithmetic** puzzle layer — experienced players will learn that pushing 4 spaces in one direction returns to the original face. This is emergent depth that rewards mastery.

### 3.4 Visual Readability Challenges

The #1 risk with dice mechanics is **readability**. The player must:
1. See the current top face of every die on the board
2. Predict what the top face will be after a push
3. Remember what each face number *does* for each die color

**Mitigation strategies:**
- **Large, clear face numbers** on top of each die (not just pips — use digits)
- **Color coding** per die type (red = bomb, blue = slide) so the player knows the ability category at a glance
- **Ghost preview:** When the player selects a push direction, show a ghost of the die at its destination with the resulting top face. This eliminates mental math and lets the player focus on strategy.
- **Face legend on screen:** A persistent, small UI element showing "Red die: top face = explosion countdown" and "Blue die: top face = slide distance"

### 3.5 The Blue Die: Slide Mechanic

The blue die slides forward by the number shown on its top face after being pushed. This creates a compound action:

1. Player pushes the blue die one space (face changes due to roll)
2. The die then slides an additional N spaces (where N = new top face)
3. The die does *not* roll during the slide (it glides, like on ice)

**Design implications:**
- The slide distance is determined *after* the roll, not before — so the player must predict the new face
- If the die slides into a wall, it stops (does it take damage? bounce? this is a design choice)
- If the die slides into another die, it either stops or pushes it (another design choice — we recommend stopping, to differentiate from normal pushing)
- The slide creates **reach** — the blue die can affect tiles far from the player

**Potential exploit to address:** Can the player push the blue die so it shows 6 and slides across the entire board? If grids are small (5×5), the maximum useful slide is 4 — the grid naturally caps the exploit.

### 3.6 The Red Die: Bomb Mechanic

The red die's top face is a countdown timer. Each turn, the countdown decreases by 1. When it reaches 0, the die explodes in a cross pattern (Bomberman-style).

**Design considerations:**
- **Does rolling change the countdown?** Yes — rolling changes the top face, which *is* the countdown. This is the key interaction: pushing the red die resets/changes its fuse. The player manipulates timing through spatial action.
- **Explosion range:** Fixed range (e.g., 2 tiles in each cardinal direction) or variable (= the face number when it detonated)? We recommend **fixed range** for readability — the countdown is already one variable to track; adding variable range doubles the mental load.
- **What does the explosion destroy?** Walls, other dice, the player? Each choice creates different puzzle dynamics. Recommend: destroys walls and other dice, kills the player → forces the player to be outside the blast radius when it detonates.
- **Chain reactions:** If the blast hits another red die, that die explodes immediately regardless of its countdown. This creates Bomberman-style chain reaction puzzles — extremely satisfying when the player engineers a cascade.

### 3.7 Future Die Colors (Speculation)

Based on the patterns above, strong candidates for additional die colors:

| Color | Mechanic | Why It Works |
|-------|----------|-------------|
| Green | Top face = height. Die acts as a ramp/platform for the player or other dice. | Adds vertical dimension; interacts with all other dice. |
| Yellow | Top face = pull range. Attracts adjacent objects toward it like a magnet. | Inverse of push; creates new movement possibilities. |
| Purple | Top face = clone count. When pushed, splits into N smaller dice. | Exponential state expansion; creates overwhelming-then-simplifying dynamics. |

**Recommendation:** Do not add these until the blue and red dice are fully explored. Each color should justify 10+ unique puzzle ideas on its own before being added.

---

## 4. Surprise & Delight Moments

### 4.1 The Interest Curve

Baba Is You's puzzles don't have one "aha" moment at the end — they have **multiple small peaks throughout the solving process**. The player might realize:
1. "Oh, I can push *that* word" (small aha)
2. "Wait, that changes *this* rule" (medium aha)
3. "And *that* lets me reach the flag!" (resolution)

**For TheDiceGame:** Design levels where the solution has 2-3 insight steps, not just one. Example:
1. "I need to get this die to show 3" (goal identification)
2. "But I can't push it north because of the wall... unless I first destroy the wall with the red die" (tool identification)
3. "To destroy the wall, I need to roll the red die to show 2 so it detonates in 2 turns while I move out of the way" (timing puzzle)

### 4.2 The Hidden Mechanic Reveal

A Monster's Expedition's greatest moments come when the player discovers a mechanic that was **always possible but never required** until now. Example: logs can form rafts when placed side-by-side in water. The game never teaches this — the player stumbles into it when a puzzle seems impossible, then notices two logs near the shore.

**For TheDiceGame:** Potential hidden mechanics to reveal late in the game:
- The player can stand *on top of* a die (not initially obvious)
- Two dice pushed into each other combine/interact (e.g., blue die slides red die)
- A die pushed off the edge of the map wraps around (if the grid is toroidal)
- The player can push a die *into* a wall to deliberately stop it at a specific face

### 4.3 The Recontextualization Moment

Stephen's Sausage Roll's deepest "aha" moments come when the player realizes a mechanic they've been using for 50 levels has **another application they never considered**. The mechanic was always there — they just didn't see it.

**For TheDiceGame:** After players master the blue die's slide (top face = slide distance), reveal that the slide can push *other* dice. The player already knows how slides work, but using slides as a remote control for positioning other dice is a recontextualization that feels brilliant.

### 4.4 What Creates "Out-of-the-Box" Feeling

From analyzing across all researched games, the "out of the box" feeling comes from three sources:

1. **Breaking assumed constraints:** The player assumed they couldn't do X, but the rules actually allow it. (Baba Is You: "Wait, I can change what 'I' am?!")
2. **Using a mechanic for a non-obvious purpose:** The player learns a mechanic for purpose A, then must use it for purpose B. (A Monster's Expedition: logs as bridges vs. logs as rafts)
3. **Elegant necessity:** The puzzle seems impossible until the player finds a solution that feels inevitable in retrospect. Every element of the level was needed; nothing was wasted. (Stephen's Sausage Roll: every tile matters)

---

## 5. MVP Scope Recommendations

### 5.1 MoSCoW Prioritization

#### Must Have (Launch Blocker)
- Grid-based movement (player on a grid, turn-based)
- One die type fully implemented (recommend **blue die** — the slide is immediately satisfying and easy to understand)
- 15-20 handcrafted levels for the blue die
- Undo system (unlimited undo, turn-by-turn — this is **non-negotiable** for a puzzle game)
- Full level reset button
- Clear win condition per level (die on target tile showing correct face, or similar)
- Visual display of current top face on every die
- Small grid sizes (3×3 to 6×6)

#### Should Have (Important for Fun)
- Red die as second mechanic (5-10 additional levels)
- 5-10 combination levels (blue + red together)
- Ghost preview showing die destination and resulting face when push direction is selected
- Sound effects for rolling, sliding, exploding
- Level select screen with completion tracking

#### Could Have (Polish)
- Branching level structure (A Monster's Expedition style — not strictly linear)
- Optimal solution tracking (par moves)
- Animated dice rolling (satisfying roll animation)
- Particle effects for explosions
- Ambient music

#### Won't Have (V1)
- Third die color (too early — explore blue and red fully first)
- Level editor (build one later if the game finds an audience)
- Online features
- Story/narrative layer
- Procedural level generation (handcrafted only — procedural Sokoban levels are almost universally unsatisfying)

### 5.2 Recommended Level Progression (MVP)

```
World 1: Blue Die Basics (Levels 1-8)
  1. Push a die onto a target (learn pushing)
  2. Push a die 2 spaces — face changes (learn rolling)
  3. Reach a target that requires a specific face showing (learn face-planning)
  4. Navigate around walls to get the right face (learn path matters)
  5. Push a die into a wall to stop it mid-slide (learn slide mechanic)
  6. Use the slide to reach a distant target (learn slide as tool)
  7. Two blue dice — slide one to create a wall for the other
  8. "Boss" — complex blue die puzzle combining all concepts

World 2: Red Die Basics (Levels 9-14)
  9. Red die explodes when countdown reaches 0 (learn explosion)
  10. Position red die so explosion destroys a wall blocking the exit
  11. Roll the red die to set a specific countdown (learn timing control)
  12. Get out of the blast radius before detonation (learn spatial+temporal planning)
  13. Chain reaction: one red die detonates another
  14. "Boss" — multi-step explosion puzzle

World 3: Blue + Red Combination (Levels 15-20)
  15. Use blue die's slide to position red die for explosion
  16. Destroy a wall with red die to create a slide path for blue die
  17. Time the explosion so the blue die slides through the cleared path
  18. Two red dice, one blue die — complex interaction
  19. The "recontextualization" level — blue die can be slid by red die's explosion
  20. Final challenge — requires mastery of all mechanics
```

### 5.3 The Prototype Litmus Test

Before building all 20 levels, build **levels 1, 3, 5, and 9** (one from each concept cluster). Playtest these four levels with 3-5 people. If players:
- Complete level 1 without help → pushing is intuitive ✓
- Have an "oh!" moment on level 3 → face-tracking is learnable ✓
- Feel clever solving level 5 → slide mechanic is satisfying ✓
- Understand the countdown on level 9 without explanation → red die is readable ✓

If any of these fail, iterate on that level before building the rest.

---

## 6. Risk Factors

### 6.1 State Complexity Overwhelm

**The risk:** Each die has 24 possible orientations. Two dice = 576 possible combined states. Players cannot hold this in their head.

**Mitigation:** Only the top face matters. This reduces each die to 6 states, and two dice to 36 combined states — still complex but manageable. Never design puzzles that require tracking side faces. The ghost preview system is essential.

### 6.2 Deadlock States Without Feedback

**The risk:** The player reaches a board state where the puzzle is unsolvable, but doesn't know it. They spend minutes trying to solve an impossible position, become frustrated, and quit.

**Mitigation:**
- Generous undo system (undo to any previous turn)
- Full reset button always visible
- Consider a "this position may be unsolvable" hint after N moves without progress (optional, controversial — some purists dislike this)
- Design levels to minimize deadlock states. Prefer levels where most states are solvable, even if sub-optimally

### 6.3 Difficulty Spikes

**The risk:** A level is dramatically harder than the one before it. The player feels the game went from "fun" to "impossible" with no warning.

**Mitigation:** Playtest extensively. If a level takes 10× longer than the previous one, insert a bridge level between them. Use the "between" technique from Patrick Traynor: design a level that's halfway between the easy one and the hard one.

### 6.4 The "Baba Problem" — Late-Game Variable Explosion

**The risk:** Baba Is You's late-game levels are criticized for having too many word blocks and possible rule combinations. The puzzle becomes a combinatorial search rather than an elegant insight puzzle.

**Mitigation:** Cap the number of dice per level. Our recommendation:
- Tutorial levels: 1 die
- Standard levels: 2 dice
- Hard levels: 3 dice
- Maximum ever: 4 dice (and only 1-2 levels should reach this)

Every die added doubles the state space. Keep it tight.

### 6.5 Artificial-Feeling Constraints

**The risk:** From ExtraTricky: "Narrowness makes it very obvious that the puzzle author is trying to force something particular, and the solver doesn't get room to play around." If the grid has a narrow corridor that forces one specific sequence, the player feels manipulated rather than challenged.

**Mitigation:** Prefer puzzles where constraints emerge from mechanic interactions, not from wall placement. A level where the player *can't* push a die left because another die is in the way feels natural. A level where the player can't push a die left because there's an arbitrary wall there feels artificial.

### 6.6 Mental Math Tax

**The risk:** Players must constantly calculate: "If I push north 2 spaces, the face changes from 3 to... let me think... rotate twice... 5? No, 1? Wait..." This arithmetic friction kills flow state.

**Mitigation:** The ghost preview is the single most important UX feature. Show the player what will happen before they commit. Also consider: should the die face prediction be a *skill* the player develops (no preview, more hardcore) or a *given* (always preview, focus on strategy)? For the MVP, **always show the preview**. You can add a "no preview" hard mode later.

### 6.7 Undo System Design

**The risk:** An undo system that's too generous removes consequences (and thus, puzzle tension). An undo system that's too limited causes frustration in a game where experimentation is necessary.

**Recommendation:** Unlimited turn-by-turn undo (press undo = reverse one move). This is the modern puzzle game standard. Baba Is You, A Monster's Expedition, Stephen's Sausage Roll, and Patrick's Parabox all use unlimited undo. There is no debate here — unlimited undo is required.

### 6.8 Insufficient Playtesting

**The risk:** The designer can solve every puzzle because they designed it. They mistake their familiarity for the puzzle being well-designed. In reality, the puzzle requires a logical leap that no player will make.

**Mitigation:** Watch people play. Don't help them. Note where they get stuck. If 3/5 testers get stuck at the same point, the puzzle needs redesign — not the player.

---

## 7. Sources

### Developer Talks & Postmortems
- [Reading the Rules of Baba Is You — GDC 2020 (Arvi Teikari)](https://gdcvault.com/play/1026628/Reading-the-Rules-of-Baba)
- [Designing Baba Is You's Rule-Writing System — Game Developer](https://www.gamedeveloper.com/design/designing-i-baba-is-you-i-s-delightfully-innovative-rule-writing-system)
- [The Relaxing, Open-World Puzzle Design of A Monster's Expedition — Game Developer](https://www.gamedeveloper.com/console/the-relaxing-open-world-puzzle-design-of-i-a-monster-s-expedition-i-)
- [Level Design Workshop: Solving Puzzle Design — GDC Vault](https://www.gdcvault.com/play/1023139/Level-Design-Workshop-Solving-Puzzle)

### Design Analyses
- [Puzzle Level Idea Strategies — Patrick Traynor (Patrick's Parabox)](https://cwpat.me/misc/puzzle-level-idea-strategies/)
- [High-Potential Puzzle Patterns — ExtraTricky](https://extratricky.com/blog/puzzle-patterns)
- [A Monster's Expedition Analysis — The Scientific Gamer](https://scientificgamer.com/thoughts-a-monsters-expedition/)
- [Baba Is You Developer Interview — Indie Game Website](https://www.indiegamewebsite.com/2019/07/19/baba-is-you-developer-arvi-teikari-talks-indie-innovation-influences-and-puzzle-design/)

### Game References
- [Devil Dice (XI) — Wikipedia](https://en.wikipedia.org/wiki/Devil_Dice)
- [A Monster's Expedition — Wikipedia](https://en.wikipedia.org/wiki/A_Monster's_Expedition)
- [Baba Is You — Wikipedia](https://en.wikipedia.org/wiki/Baba_Is_You)
- [Inside: Teaching Through Level Design — Game Developer](https://www.gamedeveloper.com/design/inside---teaching-through-level-design)

### Puzzle Design Theory
- [Tutorial Design in Puzzledorf — Game Developer](https://www.gamedeveloper.com/blogs/tutorial-design-in-puzzledorf-reflections)
- [How to Design Puzzle Games — Medium](https://medium.com/design-bootcamp/how-to-design-puzzle-games-319aef443c44)
- [Puzzle Game Design Principles — Game Design Skills](https://gamedesignskills.com/game-design/puzzle/)

---

*Document created 2026-04-24 for TheDiceGame pre-production research phase.*
