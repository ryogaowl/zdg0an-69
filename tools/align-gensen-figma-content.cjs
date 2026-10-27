const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {operations} = require('./refine-gensen-content.cjs');
const root = path.resolve(__dirname,'..');
const dir = path.join(root,'docs/verification/gensen');
const plan = JSON.parse(fs.readFileSync(path.join(dir,'figma-content-plan-20261027.json')));
if (!process.argv.includes('--apply')) { console.log('Reviewed Figma copy only; use --apply to write.'); return; }
const receiptFile=path.join(dir,'figma-content-receipt-20261027.json');
if(fs.existsSync(receiptFile)) throw new Error('Receipt exists. Review before replaying.');
function execute(query,variables,mutate=false) {
  const args=['store','execute','--store','zdg0an-69.myshopify.com','--version','2026-07','--query',query,'--json'];
  if(variables)args.push('--variables',JSON.stringify(variables));
  if(mutate)args.push('--allow-mutations');
  const r=JSON.parse(execFileSync('shopify',args,{cwd:root,encoding:'utf8',env:{...process.env,SHOPIFY_CLI_NO_ANALYTICS:'1'},stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}));
  if(r.errors?.length)throw new Error(JSON.stringify(r.errors));
  for(const v of Object.values(r))if(v?.userErrors?.length)throw new Error(JSON.stringify(v.userErrors));
  return r;
}
const before=execute(operations.read);
fs.writeFileSync(path.join(dir,'figma-content-before-20261027.json'),JSON.stringify(before,null,2)+'\n');
const receipt={results:[]};
function apply(label,op,variables){const result=execute(operations[op],variables,true);receipt.results.push({label,result});fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n');console.log(label);}
for(const [key,name,description] of [
  ['product_display_name','ページ表示名','商品管理・注文で使う商品名と分けて表示。例：GENSEN'],
  ['product_label','商品名の補足ラベル','ページ表示名に添える短い品種。例：源泉水。スラッシュの入力は不要。'],
])apply(key,'field',{definition:{namespace:'custom',key,name,description,type:'single_line_text_field',ownerType:'PRODUCT',pin:true,access:{storefront:'PUBLIC_READ'}}});
apply('display-names','values',{metafields:plan.productNames.flatMap(p=>[
  {ownerId:p.id,namespace:'custom',key:'product_display_name',type:'single_line_text_field',value:p.name,compareDigest:null},
  {ownerId:p.id,namespace:'custom',key:'product_label',type:'single_line_text_field',value:p.label,compareDigest:null},
])});
for(const story of plan.stories)apply('story:'+story.key,'entry',{handle:{type:'ichido_product_story',handle:'gensensui-water-'+story.key},metaobject:{fields:[
  {key:'heading',value:story.heading},
  {key:'body',value:JSON.stringify({type:'root',children:story.paragraphs.map(value=>({type:'paragraph',children:[{type:'text',value}]}))})},
]}});
fs.writeFileSync(path.join(dir,'figma-content-after-20261027.json'),JSON.stringify(execute(operations.read),null,2)+'\n');
