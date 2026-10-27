const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'docs/verification/gensen');
const before = JSON.parse(fs.readFileSync(path.join(dir, 'data-before-20261027.json'), 'utf8'));
const store = 'zdg0an-69.myshopify.com';
const productId = 'gid://shopify/Product/15907648274592';
if (before.product.id !== productId || before.product.handle !== 'gensensui-water') throw new Error('Unexpected source product');
const operations = {
  definition: 'mutation Definition($definition: MetaobjectDefinitionCreateInput!) { metaobjectDefinitionCreate(definition: $definition) { metaobjectDefinition { id type } userErrors { field message code } } }',
  field: 'mutation Field($definition: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $definition) { createdDefinition { id namespace key } userErrors { field message code } } }',
  entry: 'mutation Entry($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) { metaobjectUpsert(handle: $handle, metaobject: $metaobject) { metaobject { id handle } userErrors { field message code } } }',
  values: 'mutation Values($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { metafields { namespace key type value } userErrors { field message code } } }',
  files: 'mutation Files($files: [FileCreateInput!]!) { fileCreate(files: $files) { files { id fileStatus } userErrors { field message code } } }',
  current: 'query { product(id: "gid://shopify/Product/15907648274592") { id updatedAt metafields(first: 40) { nodes { namespace key type value } } } }',
};
const assets = [
  ['lake', '鳴子温泉郷の潟沼', 'https://ichido.co/cdn/shop/t/5/assets/gensen-lake.jpg?v=34827281091035440211792603916'],
  ['source', '地中から湧き出す源泉', 'https://ichido.co/cdn/shop/t/5/assets/gensen-source.jpg?v=5699575806027827831792603922'],
  ['facility', '源泉水の採水施設', 'https://ichido.co/cdn/shop/t/5/assets/gensen-facility.jpg?v=37395244863165191251792603914'],
  ['mineral', '天然由来のミネラル', 'https://ichido.co/cdn/shop/t/5/assets/gensen-mineral.jpg?v=110351296993050874371792603918'],
  ['waterfall', '森の中を流れる滝', 'https://ichido.co/cdn/shop/t/5/assets/gensen-waterfall.jpg?v=103110624551114285371792603924'],
];
const text = html => html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
const paragraphs = [...before.product.descriptionHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m => text(m[1])).filter(Boolean);
const stories = [];
for (const p of paragraphs) {
  const match = p.match(/^POINT\s*0?([1-4])\s*[｜|]\s*(.+)$/s);
  if (!stories.length || match) stories.push({ heading: match ? match[2] : p, point: match ? match[1] : '', paragraphs: [] });
  else stories.at(-1).paragraphs.push(p);
}
if (stories.length !== 5 || stories.some(s => !s.paragraphs.length)) throw new Error('Unexpected description structure; review manually');
const definitions = [
  {type:'ichido_product_story',name:'商品説明セクション',displayNameKey:'heading',access:{storefront:'PUBLIC_READ'},fieldDefinitions:[
    {key:'heading',name:'見出し',type:'single_line_text_field',required:true},
    {key:'body',name:'本文',type:'rich_text_field',required:true},
    {key:'image',name:'画像',type:'file_reference',validations:[{name:'file_type_options',value:'["Image"]'}]},
    {key:'point',name:'ポイント番号（導入は空欄）',type:'single_line_text_field'},
  ]},
  {type:'ichido_product_faq',name:'商品FAQ',displayNameKey:'question',access:{storefront:'PUBLIC_READ'},fieldDefinitions:[
    {key:'question',name:'質問',type:'single_line_text_field',required:true},
    {key:'answer',name:'回答',type:'rich_text_field',required:true},
  ]},
];
const fields = [
  {namespace:'custom',key:'product_subtitle',name:'商品補足',type:'single_line_text_field'},
  {namespace:'custom',key:'product_badges',name:'特徴ラベル',type:'list.single_line_text_field'},
  {namespace:'custom',key:'product_stories',name:'説明セクション',type:'list.metaobject_reference',reference:'ichido_product_story'},
  {namespace:'custom',key:'product_faqs',name:'FAQ',type:'list.metaobject_reference',reference:'ichido_product_faq'},
  {namespace:'custom',key:'related_products',name:'関連商品',type:'list.product_reference'},
  {namespace:'seo',key:'hidden',name:'検索エンジンから非表示',type:'number_integer',validations:[{name:'min',value:'0'},{name:'max',value:'1'}]},
];
const plan = {store,productId,sourceUpdatedAt:before.product.updatedAt,definitions,fields,stories:stories.map((s,i)=>({...s,asset:assets[i]})),subtitle:'Core Water 1ケース（24本）',seoHidden:1,unchanged:['title','descriptionHtml','price','inventory','status','templateSuffix','selling plans']};
const planFile = path.join(dir, 'data-migration-plan-20261027.json');
fs.writeFileSync(planFile, JSON.stringify(plan,null,2)+'\n');
if (!process.argv.includes('--apply')) { console.log('Prepared '+planFile); process.exit(0); }

const receiptFile = path.join(dir, 'data-migration-receipt-20261027.json');
if (fs.existsSync(receiptFile)) throw new Error('A migration receipt exists. Inspect it before resuming; do not replay blindly.');
const receipt = {store,productId,results:[]};
const execute = (query,variables,mutate=false) => {
  const args=['store','execute','--store',store,'--version','2026-07','--query',query,'--json'];
  if (variables) args.push('--variables',JSON.stringify(variables));
  if (mutate) args.push('--allow-mutations');
  const r=JSON.parse(execFileSync('shopify',args,{cwd:root,encoding:'utf8',env:{...process.env,SHOPIFY_CLI_NO_ANALYTICS:'1'},stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}));
  if (r.errors?.length) throw new Error(JSON.stringify(r.errors));
  for(const v of Object.values(r)) if(v?.userErrors?.length) throw new Error(JSON.stringify(v.userErrors));
  return r;
};
const current=execute(operations.current).product;
if(current.updatedAt!==before.product.updatedAt || current.metafields.nodes.length) throw new Error('Product changed after backup; review before proceeding');
function save(label,result){receipt.results.push({label,result});fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n');console.log(label+' complete');}
const definitionIds={};
for(const definition of definitions){const r=execute(operations.definition,{definition},true);save('definition:'+definition.type,r);definitionIds[definition.type]=r.metaobjectDefinitionCreate.metaobjectDefinition.id;}
for(const field of fields){const {reference,...base}=field;const definition={...base,ownerType:'PRODUCT',pin:true,...(base.namespace==='custom'?{access:{storefront:'PUBLIC_READ'}}:{})};if(reference)definition.validations=[{name:'metaobject_definition_id',value:definitionIds[reference]}];save('field:'+base.namespace+'.'+base.key,execute(operations.field,{definition},true));}
const files=execute(operations.files,{files:assets.map(([key,alt,url])=>({originalSource:url,contentType:'IMAGE',alt,filename:`ichido-gensen-story-${key}.jpg`}))},true);save('files',files);
if(files.fileCreate.files.length!==5)throw new Error('Expected five file results');
const storyIds=[];
for(let i=0;i<stories.length;i++){
  const s=stories[i];
  const body={type:'root',children:s.paragraphs.map(value=>({type:'paragraph',children:[{type:'text',value}]}))};
  const fields=[{key:'heading',value:s.heading},{key:'body',value:JSON.stringify(body)},{key:'image',value:files.fileCreate.files[i].id}];
  if(s.point)fields.push({key:'point',value:s.point});
  const r=execute(operations.entry,{handle:{type:'ichido_product_story',handle:`gensensui-water-${assets[i][0]}`},metaobject:{fields}},true);save('story:'+assets[i][0],r);storyIds.push(r.metaobjectUpsert.metaobject.id);
}
save('product-values',execute(operations.values,{metafields:[
  {ownerId:productId,namespace:'custom',key:'product_subtitle',type:'single_line_text_field',value:plan.subtitle,compareDigest:null},
  {ownerId:productId,namespace:'custom',key:'product_stories',type:'list.metaobject_reference',value:JSON.stringify(storyIds),compareDigest:null},
  {ownerId:productId,namespace:'seo',key:'hidden',type:'number_integer',value:'1',compareDigest:null},
]},true));
console.log('Migration written. Read back the product and all new references before reporting success.');
