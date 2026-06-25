import React, { useState } from 'react';

const recipes = [
  { id:1, name:'Avocado Toast', category:'Breakfast', emoji:'🥑', difficulty:'Easy', prepTime:5, cookTime:5, servings:2, ingredients:['2 slices sourdough bread','1 ripe avocado','2 eggs','Salt & pepper','Red pepper flakes','Lemon juice'], steps:['Toast the bread until golden brown.','Mash avocado with lemon juice, salt, and pepper.','Fry or poach eggs to your liking.','Spread avocado on toast, top with egg.','Garnish with red pepper flakes.'], tags:['healthy','vegetarian','quick'] },
  { id:2, name:'Pancakes', category:'Breakfast', emoji:'🥞', difficulty:'Easy', prepTime:10, cookTime:15, servings:4, ingredients:['2 cups flour','2 tbsp sugar','2 tsp baking powder','1/2 tsp salt','2 eggs','1.5 cups milk','3 tbsp butter','1 tsp vanilla'], steps:['Mix dry ingredients in a large bowl.','Whisk eggs, milk, melted butter, and vanilla.','Combine wet and dry ingredients — don\'t overmix.','Heat a greased skillet over medium heat.','Pour 1/4 cup batter per pancake.','Cook until bubbles form, then flip.','Serve with maple syrup.'], tags:['breakfast','sweet','comfort'] },
  { id:3, name:'Grilled Cheese Sandwich', category:'Lunch', emoji:'🧀', difficulty:'Easy', prepTime:5, cookTime:10, servings:1, ingredients:['2 slices bread','2 oz cheddar cheese','1 tbsp butter','1 tsp garlic powder'], steps:['Butter one side of each bread slice.','Layer cheese between unbuttered sides.','Cook in a skillet over medium-low heat.','Press gently and cook 3-4 min per side.','Cut diagonally and serve hot.'], tags:['comfort','quick','vegetarian'] },
  { id:4, name:'Caesar Salad', category:'Lunch', emoji:'🥗', difficulty:'Medium', prepTime:15, cookTime:0, servings:2, ingredients:['1 head romaine lettuce','1/2 cup parmesan','1 cup croutons','3 tbsp Caesar dressing','1 lemon','Black pepper'], steps:['Wash and chop romaine lettuce.','Toss with Caesar dressing.','Add parmesan and croutons.','Squeeze lemon over the top.','Season with black pepper and serve.'], tags:['healthy','vegetarian','salad'] },
  { id:5, name:'Spaghetti Bolognese', category:'Dinner', emoji:'🍝', difficulty:'Medium', prepTime:15, cookTime:45, servings:4, ingredients:['400g spaghetti','500g ground beef','1 onion','3 garlic cloves','400g canned tomatoes','2 tbsp tomato paste','Olive oil','Salt, pepper, oregano','Parmesan to serve'], steps:['Cook spaghetti al dente per package.','Sauté diced onion in oil 5 min.','Add garlic and beef, cook until browned.','Stir in tomato paste, cook 2 min.','Add canned tomatoes and oregano.','Simmer 30 minutes, season to taste.','Toss pasta with sauce, top with parmesan.'], tags:['italian','hearty','family'] },
  { id:6, name:'Chicken Stir Fry', category:'Dinner', emoji:'🥘', difficulty:'Medium', prepTime:20, cookTime:15, servings:3, ingredients:['500g chicken breast','2 cups mixed vegetables','3 tbsp soy sauce','1 tbsp sesame oil','2 garlic cloves','1 tbsp ginger','1 tbsp cornstarch','Cooked rice'], steps:['Slice chicken thinly and marinate with soy sauce and cornstarch.','Heat sesame oil in a wok over high heat.','Stir fry garlic and ginger 30 seconds.','Add chicken, cook 5-6 min until done.','Add vegetables, stir fry 3-4 min.','Toss everything together with remaining soy sauce.','Serve over rice.'], tags:['asian','quick','protein'] },
  { id:7, name:'Chocolate Brownies', category:'Dessert', emoji:'🍫', difficulty:'Easy', prepTime:15, cookTime:25, servings:12, ingredients:['200g dark chocolate','150g butter','200g sugar','3 eggs','100g flour','2 tbsp cocoa powder','1 tsp vanilla','Pinch of salt'], steps:['Preheat oven to 180°C (350°F).','Melt chocolate and butter together.','Whisk in sugar, then eggs one by one.','Add vanilla and fold in flour, cocoa, salt.','Pour into a greased 9x9 pan.','Bake 20-25 min — don\'t overbake.','Cool completely before cutting into squares.'], tags:['chocolate','sweet','baking'] },
  { id:8, name:'Banana Smoothie', category:'Breakfast', emoji:'🍌', difficulty:'Easy', prepTime:5, cookTime:0, servings:2, ingredients:['2 ripe bananas','1 cup milk','1/2 cup yogurt','2 tbsp honey','Ice cubes','Pinch of cinnamon'], steps:['Peel and slice bananas.','Add all ingredients to blender.','Blend on high until smooth.','Adjust sweetness with honey.','Pour into glasses and serve immediately.'], tags:['healthy','quick','vegan'] },
  { id:9, name:'Margherita Pizza', category:'Dinner', emoji:'🍕', difficulty:'Hard', prepTime:30, cookTime:12, servings:4, ingredients:['Pizza dough','200ml tomato sauce','200g mozzarella','Fresh basil','Olive oil','Salt'], steps:['Preheat oven to 250°C (480°F) with pizza stone.','Stretch dough into a thin circle.','Spread tomato sauce leaving a border.','Tear mozzarella and distribute evenly.','Drizzle with olive oil and season.','Bake 10-12 min until crust is golden.','Top with fresh basil and serve.'], tags:['italian','vegetarian','classic'] },
  { id:10, name:'Guacamole & Chips', category:'Snacks', emoji:'🫑', difficulty:'Easy', prepTime:10, cookTime:0, servings:4, ingredients:['3 ripe avocados','1 lime','1/2 onion diced','1 tomato diced','Cilantro','Salt & pepper','Jalapeño (optional)','Tortilla chips'], steps:['Halve and pit avocados.','Scoop flesh into a bowl.','Add lime juice and salt, mash to desired consistency.','Fold in onion, tomato, cilantro, jalapeño.','Taste and adjust seasoning.','Serve immediately with chips.'], tags:['mexican','vegetarian','dip'] },
  { id:11, name:'French Toast', category:'Breakfast', emoji:'🍞', difficulty:'Easy', prepTime:5, cookTime:10, servings:2, ingredients:['4 thick bread slices','2 eggs','1/4 cup milk','1 tsp vanilla','1 tsp cinnamon','2 tbsp butter','Maple syrup'], steps:['Whisk eggs, milk, vanilla, and cinnamon.','Heat butter in a skillet over medium heat.','Dip bread slices in egg mixture.','Cook 2-3 min per side until golden.','Serve with maple syrup and fruit.'], tags:['sweet','breakfast','comfort'] },
  { id:12, name:'Tiramisu', category:'Dessert', emoji:'☕', difficulty:'Hard', prepTime:30, cookTime:0, servings:8, ingredients:['3 eggs separated','250g mascarpone','90g sugar','1 cup strong espresso','200g ladyfinger biscuits','Cocoa powder','2 tbsp rum'], steps:['Brew espresso and let cool; mix with rum.','Beat egg yolks with sugar until pale.','Fold in mascarpone until smooth.','Whip egg whites to stiff peaks and fold into mascarpone.','Quickly dip ladyfingers in espresso.','Layer biscuits then cream in a dish.','Repeat layers and dust with cocoa.','Refrigerate at least 4 hours before serving.'], tags:['italian','classic','no-bake'] },
];

const CATEGORIES = ['All','Breakfast','Lunch','Dinner','Dessert','Snacks'];
const DIFFICULTIES = ['All','Easy','Medium','Hard'];
const DIFF_COLORS = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };
const CAT_COLORS = { Breakfast: '#f59e0b', Lunch: '#10b981', Dinner: '#7c3aed', Dessert: '#ec4899', Snacks: '#3b82f6' };

export default function RecipeApp() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [selected, setSelected] = useState(null);
  const [servings, setServings] = useState(1);

  const filtered = recipes.filter(r => {
    const s = search.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(s) || r.ingredients.some(i => i.toLowerCase().includes(s));
    const matchCat = category === 'All' || r.category === category;
    const matchDiff = difficulty === 'All' || r.difficulty === difficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const openRecipe = (r) => { setSelected(r); setServings(r.servings); };

  const adjustIngredient = (ing, origServings) => {
    const match = ing.match(/^([\d./]+)\s*(.*)/);
    if (!match) return ing;
    let num = match[1].includes('/') ? match[1].split('/').reduce((a,b)=>a/b) : parseFloat(match[1]);
    const adjusted = (num * servings / origServings);
    const rounded = Math.round(adjusted * 10) / 10;
    return `${rounded} ${match[2]}`;
  };

  const s = {
    wrap: { minHeight: '100vh', background: 'linear-gradient(135deg,#1a0533,#0d1b4b)', padding: '32px 20px', fontFamily: 'Segoe UI,sans-serif' },
    header: { textAlign: 'center', marginBottom: 32 },
    title: { fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 8 },
    sub: { color: '#94a3b8', fontSize: 15 },
    controls: { maxWidth: 900, margin: '0 auto 28px', display: 'flex', flexDirection: 'column', gap: 12 },
    searchInp: { width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, padding: '13px 18px', color: '#fff', fontSize: 15, outline: 'none' },
    filterRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    filterBtn: (active, color) => ({ background: active ? (color ? `${color}33` : 'rgba(124,58,237,0.3)') : 'rgba(255,255,255,0.05)', border: `1px solid ${active ? (color || '#7c3aed') : 'rgba(255,255,255,0.1)'}`, color: active ? (color || '#a78bfa') : '#94a3b8', borderRadius: 20, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' },
    card: (cat) => ({ background: 'rgba(255,255,255,0.05)', border: `1px solid ${CAT_COLORS[cat]}33`, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s,box-shadow 0.2s', boxShadow: `0 4px 20px ${CAT_COLORS[cat]}11` }),
    cardImg: (cat) => ({ height: 120, background: `linear-gradient(135deg,${CAT_COLORS[cat]}33,${CAT_COLORS[cat]}11)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }),
    cardBody: { padding: 16 },
    cardTitle: { fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8 },
    tag: (color) => ({ background: `${color}22`, color: color, border: `1px solid ${color}44`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }),
    cardMeta: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '20px', overflowY: 'auto' },
    modalCard: { background: '#1e1b4b', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 24, maxWidth: 680, width: '100%', overflow: 'hidden', marginTop: 20 },
    modalHero: (cat) => ({ height: 160, background: `linear-gradient(135deg,${CAT_COLORS[cat]}44,${CAT_COLORS[cat]}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80, position: 'relative' }),
    closeBtn: { position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18 },
    modalBody: { padding: 28 },
    modalTitle: { fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 },
    metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 },
    metaBox: (color) => ({ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 12, padding: '12px 8px', textAlign: 'center' }),
    metaVal: (color) => ({ fontSize: 20, fontWeight: 800, color: color }),
    metaLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: 700, color: '#a78bfa', marginBottom: 12, borderBottom: '1px solid rgba(124,58,237,0.3)', paddingBottom: 6 },
    ingredient: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: 14 },
    step: { display: 'flex', gap: 12, marginBottom: 12 },
    stepNum: (cat) => ({ background: CAT_COLORS[cat], color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }),
    stepText: { color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, paddingTop: 4 },
    servRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
    servBtn: (color) => ({ background: `${color}33`, border: `1px solid ${color}`, color: color, borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontWeight: 700, fontSize: 18 }),
    noResults: { textAlign: 'center', color: '#64748b', padding: '48px 20px', fontSize: 16 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.title}>👨‍🍳 Recipe Book</div>
        <p style={s.sub}>{recipes.length} delicious recipes to explore</p>
      </div>
      <div style={s.controls}>
        <input style={s.searchInp} placeholder="🔍 Search by name or ingredient..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={s.filterRow}>
          {CATEGORIES.map(c => <button key={c} style={s.filterBtn(category===c, c !== 'All' ? CAT_COLORS[c] : null)} onClick={() => setCategory(c)}>{c !== 'All' && '●'} {c}</button>)}
          <span style={{ flex: 1 }} />
          {DIFFICULTIES.map(d => <button key={d} style={s.filterBtn(difficulty===d, d !== 'All' ? DIFF_COLORS[d] : null)} onClick={() => setDifficulty(d)}>{d}</button>)}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div style={s.noResults}>😕 No recipes found. Try different filters.</div>
      ) : (
        <div style={s.grid}>
          {filtered.map(r => (
            <div key={r.id} style={s.card(r.category)} onClick={() => openRecipe(r)}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${CAT_COLORS[r.category]}33`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 20px ${CAT_COLORS[r.category]}11`; }}>
              <div style={s.cardImg(r.category)}>{r.emoji}</div>
              <div style={s.cardBody}>
                <div style={s.cardTitle}>{r.name}</div>
                <div style={s.cardMeta}>
                  <span style={s.tag(CAT_COLORS[r.category])}>{r.category}</span>
                  <span style={s.tag(DIFF_COLORS[r.difficulty])}>{r.difficulty}</span>
                  <span style={s.tag('#94a3b8')}>⏱ {r.prepTime + r.cookTime}m</span>
                  <span style={s.tag('#94a3b8')}>👥 {r.servings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div style={s.modal} onClick={() => setSelected(null)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <div style={s.modalHero(selected.category)}>
              {selected.emoji}
              <button style={s.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.modalTitle}>{selected.name}</div>
              <div style={s.metaGrid}>
                <div style={s.metaBox('#f59e0b')}><div style={s.metaVal('#f59e0b')}>{selected.prepTime}m</div><div style={s.metaLabel}>Prep</div></div>
                <div style={s.metaBox('#3b82f6')}><div style={s.metaVal('#3b82f6')}>{selected.cookTime}m</div><div style={s.metaLabel}>Cook</div></div>
                <div style={s.metaBox(DIFF_COLORS[selected.difficulty])}><div style={s.metaVal(DIFF_COLORS[selected.difficulty])}>{selected.difficulty}</div><div style={s.metaLabel}>Difficulty</div></div>
                <div style={s.metaBox('#a78bfa')}><div style={s.metaVal('#a78bfa')}>{servings}</div><div style={s.metaLabel}>Servings</div></div>
              </div>
              <div style={s.servRow}>
                <span style={{ color: '#94a3b8', fontSize: 14 }}>Adjust Servings:</span>
                <button style={s.servBtn('#ef4444')} onClick={() => setServings(s => Math.max(1,s-1))}>−</button>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, minWidth: 30, textAlign: 'center' }}>{servings}</span>
                <button style={s.servBtn('#10b981')} onClick={() => setServings(s => s+1)}>+</button>
              </div>
              <div style={s.section}>
                <div style={s.sectionTitle}>🥄 Ingredients</div>
                {selected.ingredients.map((ing, i) => (
                  <div key={i} style={s.ingredient}>
                    <span style={{ color: '#7c3aed' }}>•</span>
                    {adjustIngredient(ing, selected.servings)}
                  </div>
                ))}
              </div>
              <div style={s.section}>
                <div style={s.sectionTitle}>📋 Instructions</div>
                {selected.steps.map((step, i) => (
                  <div key={i} style={s.step}>
                    <div style={s.stepNum(selected.category)}>{i+1}</div>
                    <div style={s.stepText}>{step}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selected.tags.map(t => <span key={t} style={s.tag('#64748b')}>#{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
