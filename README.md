# Minecraft-In-HTML
A browser-based Minecraft-style survival game inspired by Minecraft Java Edition 1.12.2, built with HTML, JavaScript, and WebGL. 
This project is based on Minecraft-IN-HTML by 11lightning11 and has been heavily expanded with additional survival mechanics, world generation, lighting, water, farming, crafting, furnaces, chests, mobs, day/night cycle, and many other gameplay systems. 
The project uses original Minecraft Java Edition 1.12.2 textures by Mojang to preserve the classic visual style.

The current version includes Survival and Creative modes, procedurally generated biomes, forests, mountains, deserts, oceans, beaches, caves, lakes and underground ore generation. Survival features health, hunger, saturation, drowning, fall damage, item durability, block drops and death/respawn. Players can use 2×2 and 3×3 crafting, furnaces with fuel and smelting, 27-slot chests, farming with farmland and growing wheat, beds with sleeping and respawn points, and working doors. The game also features flowing water with source blocks, a full day/night cycle, skylight and torch lighting, weather-like sky changes, passive mobs including pigs, cows and sheep with AI, health, damage, sounds and drops, world item entities, first-person held-item animations, Creative flying, spectator mode, Super Breaker and an ore X-Ray mode.

versions:
v0.46 — Drowning Update 🌊
(V25.39)
Added underwater air supply.
Around 15 seconds of breathing time.
Added air bubbles to the HUD.
Drowning starts when air reaches zero.
Drowning damage: approximately 2 HP per second.
Air is restored after leaving the water.

v0.45 — Furnace Expansion 🔥
(V25.38)
Greatly expanded furnace recipes.
Coal Ore → Coal.
Iron Ore → Iron Ingot.
Gold Ore → Gold Ingot.
Diamond Ore → Diamond.
Redstone Ore → Redstone.
Lapis Ore → Lapis Lazuli.
Emerald Ore → Emerald.
Nether Quartz Ore → Quartz.
Netherrack → Nether Brick.
Sand → Glass.
Cobblestone → Stone.
Oak Log → Charcoal.
Birch Log → Charcoal.
Spruce Log → Charcoal.
Raw Pork → Cooked Pork.
Raw Mutton → Cooked Mutton.
Raw Beef → Steak.
Charcoal works as furnace fuel.
Charcoal can be used to craft torches.
Added Quartz and Nether Brick items.
Added extra block recipes.

v0.44 — Support Dependent Blocks 🌱
(V25.37)
Added support checks for blocks that depend on another block.
Breaking the block below tall grass now breaks the grass.
Also works with:
Wheat.
Torches.
Doors.
Beds.
In Survival, automatically broken blocks drop their items.
Automatic destruction does not consume tool durability.

v0.43 — 48 Mobs + FOV Culling 👁️
(V25.36)
Increased the technical passive mob limit: 24 → 48.
Added mob render culling.
Mobs outside the camera view are not rendered.
Added a +10° margin around the view.
Culled mobs still exist and continue moving.
This is not despawning.

v0.42 — Slower Passive Mob Spawn
(V25.35)
Significantly reduced passive mob spawning speed.
Natural spawn check changed from about 20 seconds to about 60 seconds.
World-generation spawning was also reduced.
Group size chances:
1 mob — 50%.
2 mobs — 25%.
3 mobs — 15%.
4 mobs — 10%.

v0.41 — Java Player Hitbox
(V25.34)
Player hitbox changed from: 0.75 × 1.8 × 0.75 to: 0.6 × 1.8 × 0.6.
Closer to Minecraft Java Edition.

v0.40 — Cow Horn Fine Tune
(V25.33)
Further adjusted horn position.
Moved horns 1.5 pixels upward.
Adjusted their Z position.
Horns remain attached to head rotation.

v0.39 — Cow Horn Lower / Closer
(V25.32)
Moved horns 3 pixels lower.
Moved horns 3 pixels closer to the body.

v0.38 — Cow Horn Position Fix
(V25.31)
Fixed horns being partially inside the cow's head.
Moved them toward the outer edges.
Raised them.

v0.37 — Cow Horns + Legs Fix
(V25.30)
Lowered cow legs slightly.
Moved horns closer to the head.
Adjusted their position relative to the head.

v0.36 — Cow Head 11/16
(V25.29)
Changed cow head distance to 11/16.

v0.35 — Cow Head Distance
(V25.28)
Intermediate cow head-position adjustment.
Head position: 9/16.

v0.34 — Cow Model Fix
(V25.27)
Removed the incorrectly floating udder.
Horns now properly follow head rotation.
Reduced the gap between head and body.
Lowered the legs.

v0.33 — Real Cow Texture 1.12.2 🐄
(V25.26)
Added the real Java 1.12.2 cow.png texture.
Texture size: 64×32.
Added proper UV mapping.
Separate UV regions for:
Head.
Body.
Legs.
Horns.

v0.32 — Cow Texture Fix Attempt 🧪
(V25.25)
First attempt to repair the broken cow 3D texture.
Used a custom micro-atlas.
Later replaced with the actual Java 1.12.2 texture.

v0.31 — Cow Spawn Egg
(V25.24)
Added Cow Spawn Egg.
Colors based on Java 1.12.2.
Fixed item-atlas capacity problems.

v0.30 — Cow + Beef Update 🐄
(V25.23)
Added cows.
10 HP.
Wandering AI.
Panic after being hit.
Follows wheat.
Natural spawning.
Added Raw Beef.
Added Steak.
Cows drop 1–3 Raw Beef.
Added cow sounds.
Raw Beef can be cooked in the furnace.

v0.29 — Spinning Item Drops
(V25.22)
Normal dropped items now rotate in 3D.
Previously mainly dropped blocks rotated.
Replaced permanent camera-facing billboards with rotating world-space item cards.

v0.28 — Mutton Update 🐑
(V25.21)
Added Raw Mutton.
Added Cooked Mutton.
Added original Java 1.12.2 textures.
Sheep drop:
White Wool.
1–2 Raw Mutton.
Raw Mutton can be cooked in the furnace.

v0.27 — Bed Leg Transparency Fix 🛏️
(V25.20)
Fixed transparent/disappearing bed legs.
Corrected the texture area used by the leg geometry.

v0.26 — Final Bed Texture Fix 🛏️
(V25.19)
Finally fixed red bed side textures.
Fixed head-half orientation.
Fixed North/East/South/West rotations.
This was effectively the point where the bed system was considered complete.

v0.25 — Stable Core / Current Branch Start ⭐
This became the stable base for the current development branch.
Base file: Minecraft_version_2_JAVA112_TORCH_WATER_NIGHT45.html
Selected after many unstable Entity Renderer experiments.
Most important survival systems were already working.
Internal V25.1–V25.18 builds contained intermediate experiments with doors, beds, mobs and rendering.
The first clearly accepted later milestone became v0.26.

v0.24 — Lighting Overhaul 💡
Added the new Skylight system.
Open sky = light level 15.
Direct vertical sky light.
Flood-fill propagation under roofs.
Light loses 1 level per propagation step.
Light can travel around corners.
Multiple light sources combine using max.
Added Torch Light.
Final lighting: max(skylight, torchLight).
Transparent blocks correctly allow light propagation.
Fixed dark tall grass.
Reduced lighting recalculation freezes.
Night brightness handled separately.

v0.23 — Torch Update 🔥
Added torches.
Added torch_on.png.
Recipe: Coal + Stick → 4 Torches.
Torches emit light.
Added item-like rendering.
Torches cannot be placed underwater.
Failed underwater placement does not consume the item in Survival.

v0.22 — Day & Night ☀️🌙
Added a full cycle of about 20 minutes.
Dawn.
Day.
Sunset.
Night.
Sunrise.
Added sun.
Added moon.
Dynamic sky colors.
Dynamic world brightness.
World time is saved.
Fixed the sun incorrectly moving with the camera.

v0.21 — Sound System 🔊
Added a large Minecraft sound pack.
Integrated dozens of sounds.
Footsteps.
Block breaking.
Block placing.
Water.
Swimming.
Damage.
Falling.
Eating.
Furnace.
Chest.
GUI.
Cave ambience.
Added small random pitch variation.

v0.20 — Farming Update 🌾
Hoe converts grass/dirt into farmland.
Added farmland hydration.
Water hydrates farmland within 4 blocks.
Added 8 wheat growth stages.
Wet and dry farmland have different growth speeds.
Added Wheat Seeds.
Added Wheat.
Added Bread.
Added crop harvesting and drops.

v0.19 — Tall Grass
Added tallgrass.png.
No collision.
Breaks quickly.
Seeds now drop from tall grass instead of grass blocks.
Seed chance around 12.5%.
Reduced tall grass density by biome.

v0.18 — Transparent Water Renderer 🌊
Moved water into a separate transparent rendering pass.
Removed internal water faces.
Fixed visible walls between adjacent water blocks.
Improved underwater visibility.
Increased transparency.

v0.17 — Underground Water Sources
Added rare water sources inside caves.
Around 2.5% of chunks.
Maximum of one source per selected chunk.
Only active when Caves are enabled.

v0.16 — Flowing Water
Added downward flow.
Added horizontal flow.
Water levels 1–7.
Horizontal range around 7 blocks.
Water dries up after the source is removed.
Added infinite water-source behavior.
Water tick was gradually slowed to around 320 ms.
Added performance optimizations.

v0.15 — Trees Update 🌲
Oak.
Birch.
Spruce.
Reworked spruce tree shape.
Layered foliage.
Narrow top.
Visible trunk.
Reduced spruce height.
Final height around 6–9 blocks.

v0.14 — Biomes 🏞️
Added:
Plains.
Forest.
Taiga.
Desert.
Mountains.
Ocean.
Beach.
Biomes affect:
Terrain.
Surface blocks.
Trees.
Lakes.
Fixed the sharp Forest plateau problem.
Added smooth terrain blending.
v0.13 — World Creation Settings
Added:
Sea On/Off.
Lakes On/Off.
Biomes On/Off.
Trees On/Off.
Caves On/Off.
Settings are saved with the world.
Added compatibility defaults for old saves.
Biomes Off creates a Plains-like world.

v0.12 — Lakes
Added procedural lakes.
Reduced spawn frequency.
Removed Small lakes.
Final approximate distribution:
Medium — 70%.
Large — 25%.
Very Large — 5%.
Different lake frequencies by biome.

v0.11 — Oceans 🌊
Added sea level around Y=40.
Large ocean regions.
Ocean floor.
Beaches.
Sand and gravel.
Water is no longer a solid block.
Added swimming.
Space helps the player swim upward.
Entering water resets fall-damage accumulation.
Added underwater overlay.

v0.10 — X-Ray
Creative-only feature.
Toggle with X.
Shows major ore types.
Hides normal blocks.
Automatically disabled in Survival.
Added X-RAY: ON HUD indicator.

v0.09 — Ore Veins 💎
Removed old isolated ore generation.
Added connected ore veins.
Veins grow in six directions.
Added branching.
Vein classes:
Normal.
Small.
Large.
Mega.
Probabilities:
70%.
24%.
5%.
1%.
Added different height ranges for each ore.
Adjusted attempts per chunk.
Generator was tested programmatically.

v0.08 — Terrain Generation
Chunk-based world generation.
Terrain noise.
Superflat.
3D cave noise.
Grass / Dirt / Stone / Bedrock layers.
Terrain hilliness.
Fixed early createImageData errors.
Fixed incorrect putImageData usage.

v0.07 — Chest Update 📦
Added 27-slot chests.
Every chest has separate contents.
Chest contents are saved.
Items are returned when a chest is broken.
Added Shift+Click.
Used original generic_54.png.
Used original chest texture.
Added open/close sounds.
Fixed GUI freezes.
Fixed white GUI background.

v0.06 — Furnace Update 🔥
Added a full furnace system.
Input slot.
Fuel slot.
Output slot.
Smelting progress.
Burn time.
Furnace contents stored by coordinates.
Furnace contents saved with the world.
Items return when the furnace is broken.
Added initial smelting recipes.
Added multiple fuel types.

v0.05 — Crafting Table Orientation Fix 😅
Long series of attempts to fix the upside-down crafting table.
Found the real face-index order used by the engine.
Final configuration:
Bottom = Oak Planks.
Top = Crafting Table Top.
Sides = Crafting Table Side/Front.
Crafting table orientation finally became correct.

v0.04 — Crafting
Added recipe system.
Recipes are shape-sensitive.
Added 2×2 inventory crafting.
Added 3×3 crafting table.
Used original inventory.png.
Used original crafting_table.png.
Added Shift+Click support.
Added Bread recipe.
Added Torch recipe.
Added Crafting Table recipe.
Fixed crafting GUI coordinates.

v0.03 — Java 1.12.2 Resource Pack 🎨
Added the Default-Java-1.12.2 resource pack.
Replaced many custom textures with original Java Edition textures.
Around 134 block texture slots were replaced.
Added real ore textures.
Logs.
Planks.
Wool.
Concrete.
Nether blocks.
Quartz.
Sandstone.
Glass.
Ice.
Crafting table.
Furnace.
Added real item textures for many resources and tools.
The first large texture replacement caused a serious crash.
Later rebuilt with safer fallback behavior.

v0.02 — Inventory & Hotbar
Added Survival inventory.
Added hotbar.
Item stacks.
Slot selection.
Tool durability display.
Item-in-hand rendering.
Item switching/use animations.
Fixed item positions.
Hotbar block icons were gradually reduced by around 13%.

v0.01 — Survival Foundation ⛏️
Original base: Minecraft version 2.html.
Added player health.
Hunger.
Saturation.
Fall damage.
Death.
Respawning.
Item recovery after death.
Survival / Creative modes.
Mining.
Block drops.
Tools.
Tool durability.
Different mining speeds depending on the tool.
