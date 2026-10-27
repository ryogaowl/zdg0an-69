// One-time, merchant-approved content setup. Daily editing belongs in Shopify Admin.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'docs/verification/gensen');
const store = 'zdg0an-69.myshopify.com';
const gensen = 'gid://shopify/Product/15907648274592';
const daichi = 'gid://shopify/Product/15940586373280';
const operations = {
  definition: 'mutation Definition($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) { metaobjectDefinitionUpdate(id:$id, definition:$definition) { metaobjectDefinition { id displayNameKey fieldDefinitions { key } } userErrors { field message } } }',
  field: 'mutation Field($definition: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition:$definition) { createdDefinition { id key } userErrors { field message } } }',
  entry: 'mutation Entry($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) { metaobjectUpsert(handle:$handle, metaobject:$metaobject) { metaobject { id handle displayName fields { key value } } userErrors { field message } } }',
  values: 'mutation Values($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields:$metafields) { metafields { namespace key value } userErrors { field message } } }',
  product: 'mutation Product($product: ProductUpdateInput!) { productUpdate(product:$product) { product { id descriptionHtml } userErrors { field message } } }',
  read: `query ReadContent { gensen: product(id:"${gensen}") { id handle updatedAt metafields(first:30) { nodes { namespace key value compareDigest } } } daichi: product(id:"${daichi}") { id handle status descriptionHtml metafields(first:30) { nodes { namespace key value compareDigest } } variants(first:2) { nodes { id price inventoryQuantity inventoryPolicy inventoryItem { tracked } } } media(first:5) { nodes { id status } } } metaobjectDefinitions(first:20) { nodes { id type displayNameKey fieldDefinitions { key name } } } stories: metaobjects(type:"ichido_product_story",first:20) { nodes { id handle displayName fields { key value } } } faqs: metaobjects(type:"ichido_product_faq",first:20) { nodes { id handle displayName fields { key value } } } }`,
};
module.exports = { operations };
if (require.main !== module) return;
const receiptFile = path.join(dir, 'content-refinement-receipt-20261027.json');
if (!process.argv.includes('--apply')) { console.log('Use --apply after reviewing and validating operations.'); return; }
if (fs.existsSync(receiptFile)) throw new Error('Receipt exists. Review partial/completed work before replaying.');
const execute = (query, variables, mutation = false) => {
  const args = ['store','execute','--store',store,'--version','2026-07','--query',query,'--json'];
  if (variables) args.push('--variables', JSON.stringify(variables));
  if (mutation) args.push('--allow-mutations');
  const result = JSON.parse(execFileSync('shopify', args, {cwd:root,encoding:'utf8',env:{...process.env,SHOPIFY_CLI_NO_ANALYTICS:'1'},stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}));
  if (result.errors?.length) throw new Error(JSON.stringify(result.errors));
  for (const value of Object.values(result)) if (value?.userErrors?.length) throw new Error(JSON.stringify(value.userErrors));
  return result;
};
const before = execute(operations.read);
fs.writeFileSync(path.join(dir,'content-refinement-before-20261027.json'),JSON.stringify(before,null,2)+'\n');
if (before.gensen.handle !== 'gensensui-water' || before.daichi.handle !== 'daichi-protein') throw new Error('Unexpected product');
if (before.gensen.metafields.nodes.some(f => ['product_badges','product_faqs'].includes(f.key))) throw new Error('Preview fields already contain data; review instead of overwriting.');
if (before.daichi.descriptionHtml !== '<h2>大地の恵みを、一杯に。</h2><p>Vegetable Protein</p>') throw new Error('DAICHI description changed; review instead of overwriting.');
const receipt = {store,results:[]};
const save = (label, result) => {receipt.results.push({label,result}); fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n'); console.log(label); return result;};
const apply = (label, operation, variables) => save(label,execute(operations[operation],variables,true));
for (const type of ['ichido_product_story','ichido_product_faq']) {
  const definition = before.metaobjectDefinitions.nodes.find(d=>d.type===type);
  if (!definition || definition.fieldDefinitions.some(f=>f.key==='admin_name')) throw new Error('Unexpected definition: '+type);
  apply('management-name:'+type,'definition',{id:definition.id,definition:{fieldDefinitions:[{create:{key:'admin_name',name:'管理名（サイトには表示しません）',type:'single_line_text_field',description:'商品名＋番号＋短い用途。例：GENSEN｜01 導入'}}]}});
}
const labels = {lake:'01 導入',source:'02 水源',facility:'03 マイナス電荷',mineral:'04 成分',waterfall:'05 飲み心地'};
for (const [key,label] of Object.entries(labels)) {
  const handle = 'gensensui-water-'+key;
  if (!before.stories.nodes.some(s=>s.handle===handle)) throw new Error('Missing story '+handle);
  apply('story:'+key,'entry',{handle:{type:'ichido_product_story',handle},metaobject:{fields:[{key:'admin_name',value:'GENSEN｜'+label}]}});
}
const faqIds = [];
for (let i=1;i<=5;i++) {
  const result=apply('preview-faq:'+i,'entry',{handle:{type:'ichido_product_faq',handle:'gensensui-water-preview-'+i},metaobject:{fields:[
    {key:'admin_name',value:`GENSEN｜仮FAQ 0${i}`},
    {key:'question',value:'ダミーコピー。ダミーコピー。ダミーコピー。ダミーコピー。'},
    {key:'answer',value:JSON.stringify({type:'root',children:[{type:'paragraph',children:[{type:'text',value:'回答文は準備中です。'}]}]})},
  ]}});
  faqIds.push(result.metaobjectUpsert.metaobject.id);
}
for (const type of ['ichido_product_story','ichido_product_faq']) apply('display-name:'+type,'definition',{id:before.metaobjectDefinitions.nodes.find(d=>d.type===type).id,definition:{displayNameKey:'admin_name'}});
apply('catchphrase-definition','field',{definition:{namespace:'custom',key:'product_catchphrase',name:'商品キャッチコピー',description:'カードと商品説明の導入で共用。通常は改行不要。長い文は表示幅に合わせて折り返します。',type:'multi_line_text_field',ownerType:'PRODUCT',pin:true,access:{storefront:'PUBLIC_READ'}}});
apply('product-values','values',{metafields:[
  {ownerId:gensen,namespace:'custom',key:'product_badges',type:'list.single_line_text_field',value:JSON.stringify(['国産','糖質3.5%','200kcal','タンパク質22g']),compareDigest:null},
  {ownerId:gensen,namespace:'custom',key:'product_faqs',type:'list.metaobject_reference',value:JSON.stringify(faqIds),compareDigest:null},
  {ownerId:daichi,namespace:'custom',key:'product_catchphrase',type:'multi_line_text_field',value:'大地の恵みを、一杯に。',compareDigest:null},
]});
apply('daichi-description','product',{product:{id:daichi,descriptionHtml:'<p>Vegetable Protein</p>'}});
fs.writeFileSync(path.join(dir,'content-refinement-after-20261027.json'),JSON.stringify(execute(operations.read),null,2)+'\n');
console.log('Readback saved. Publication status is unchanged.');
