const regras={
nome:v=>/^\p{L}{2,}(?:[\s'-]+\p{L}+)+$/u.test(v.trim()),
email:v=>/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(v.trim()),
cpf:v=>{const c=v.replace(/\D/g,'');if(c.length!==11||/^(\d)\1+$/.test(c))return false;for(let t=9;t<11;t++){let s=0;for(let i=0;i<t;i++)s+=c[i]*(t+1-i);if((s*10)%11%10!=c[t])return false}return true},
nascimento:v=>{if(!v)return false;const i=calcIdade(v);return i!==null&&i>=16&&i<=110},
idade:(v,f)=>{const n=Number(v);if(!/^\d{1,3}$/.test(v)||n<16||n>110)return false;const i=f.nascimento.value?calcIdade(f.nascimento.value):null;return i===null||i===n},
cep:v=>/^\d{5}-\d{3}$/.test(v),
numero:v=>/^(\d{1,6}[A-Za-z]?|s\/n)$/i.test(v.trim())
};
const erros={
nome:'Informe nome e sobrenome, somente com letras.',
email:'Digite um e-mail válido, como nome@dominio.com.',
cpf:'CPF inválido. Confira os 11 dígitos.',
nascimento:'Informe uma data válida. É preciso ter 16 anos ou mais.',
idade:'A idade deve ser 16 ou mais e coincidir com a data de nascimento.',
cep:'CEP inválido. Use o formato 00000-000.',
numero:'Informe o número da residência, como 120 ou s/n.'
};
const mascaras={
cpf:v=>v.replace(/\D/g,'').slice(0,11).replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'),
cep:v=>v.replace(/\D/g,'').slice(0,8).replace(/(\d{5})(\d)/,'$1-$2'),
idade:v=>v.replace(/\D/g,'').slice(0,3)
};
function calcIdade(v){
const d=new Date(v+'T00:00:00');
if(isNaN(d))return null;
const h=new Date();
let i=h.getFullYear()-d.getFullYear();
const m=h.getMonth()-d.getMonth();
if(m<0||(m===0&&h.getDate()<d.getDate()))i--;
return i;
}
function iniciarMenu(){
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
if(!toggle || !nav) return;
toggle.addEventListener('click',()=>{
const aberto=nav.classList.toggle('open');
toggle.setAttribute('aria-expanded',String(aberto));
toggle.setAttribute('aria-label',aberto?'Fechar menu':'Abrir menu');
});
document.querySelectorAll('.drop-btn').forEach(b=>{
b.addEventListener('click',()=>{
const aberto=b.parentElement.classList.toggle('open');
b.setAttribute('aria-expanded',String(aberto));
});
});
document.addEventListener('click',e=>{
document.querySelectorAll('.has-drop.open').forEach(li=>{
if(!li.contains(e.target)){
li.classList.remove('open');
li.querySelector('.drop-btn').setAttribute('aria-expanded','false');
}
});
});
}
function iniciarDoacoes(){
const opcoes=document.querySelectorAll('input[name="valor"]');
if(!opcoes.length)return;
const outro=document.getElementById('valor-outro');
const resumo=document.getElementById('resumo');
const alerta=document.getElementById('alerta-doacao');
const fmt=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const selecionado=()=>document.querySelector('input[name="valor"]:checked');
const frequencia=()=>document.querySelector('input[name="frequencia"]:checked').value;
const valor=()=>{const s=selecionado();if(!s)return 0;return s.value==='outro'?Number(outro.value.replace(',','.'))||0:Number(s.value)};
const atualizar=()=>{
const s=selecionado();
outro.disabled=!s||s.value!=='outro';
const v=valor();
resumo.textContent=v>0?`Sua doação: ${fmt(v)} (${frequencia()})`:'Escolha um valor para continuar';
};
document.querySelectorAll('input[name="valor"],input[name="frequencia"]').forEach(i=>i.addEventListener('change',()=>{atualizar();if(!outro.disabled&&i.name==='valor')outro.focus()}));
outro.addEventListener('input',atualizar);
document.getElementById('doar').addEventListener('click',()=>{
const v=valor();
alerta.hidden=false;
if(v<5){
alerta.className='alert error';
alerta.textContent='Escolha ou informe um valor de pelo menos R$ 5,00.';
return;
}
alerta.className='alert success';
alerta.textContent=`Obrigado! Sua doação de ${fmt(v)} (${frequencia()}) foi registrada. Conclua o envio usando a chave PIX abaixo.`;
});
const copiar=document.getElementById('copiar-pix');
copiar.addEventListener('click',async()=>{
const chave=document.getElementById('chave-pix').textContent;
try{
await navigator.clipboard.writeText(chave);
copiar.textContent='Chave copiada';
}catch{
copiar.textContent='Copie manualmente';
}
setTimeout(()=>{copiar.textContent='Copiar chave PIX'},2500);
});
atualizar();
}
function iniciarCadastro(){
const form=document.getElementById('form-cadastro');
if(!form)return;
const alerta=document.getElementById('alerta-form');
const info=document.getElementById('info-endereco');
const campos=[...form.querySelectorAll('input')];
form.nascimento.max=new Date().toISOString().slice(0,10);
const definir=(c,ok,texto)=>{
c.classList.toggle('success',ok);
c.classList.toggle('error',!ok);
c.setAttribute('aria-invalid',String(!ok));
const msgEl=document.getElementById('msg-'+c.name);
if(msgEl) msgEl.textContent=ok?'':texto;
};
const validar=c=>{
const vazio=c.value.trim()==='';
const ok=!vazio&&regras[c.name](c.value,form);
definir(c,ok,vazio?'Este campo é obrigatório.':erros[c.name]);
return ok;
};
const consultarCep=async()=>{
const c=form.cep;
if(!regras.cep(c.value))return false;
try{
const r=await fetch(`https://viacep.com.br/ws/${c.value.replace(/\D/g,'')}/json/`);
const j=await r.json();
if(j.erro){
definir(c,false,'CEP não encontrado. Confira os números.');
info.textContent='';
return false;
}
info.textContent=[j.logradouro,j.bairro,`${j.localidade}/${j.uf}`].filter(Boolean).join(' – ');
definir(c,true);
return true;
}catch{
info.textContent='';
definir(c,true);
return true;
}
};
const executar=async c=>{
const ok=validar(c);
if(c.name==='cep'&&ok)await consultarCep();
if(c.name==='nascimento'){
if(ok){form.idade.value=calcIdade(c.value);form.idade.dataset.tocado='1'}
if(form.idade.dataset.tocado)validar(form.idade);
}
};
campos.forEach(c=>{
c.addEventListener('input',()=>{
if(mascaras[c.name])c.value=mascaras[c.name](c.value);
if(c.dataset.tocado)executar(c);
});
c.addEventListener('blur',()=>{
c.dataset.tocado='1';
executar(c);
});
});
form.addEventListener('submit',async e=>{
e.preventDefault();
campos.forEach(c=>{c.dataset.tocado='1'});
const validos=campos.map(validar).every(Boolean);
const cepOk=await consultarCep();
alerta.hidden=false;
if(validos&&cepOk){
const primeiro=form.nome.value.trim().split(/\s+/)[0];
alerta.className='alert success';
alerta.textContent=`Cadastro enviado com sucesso, ${primeiro}! Entraremos em contato pelo e-mail informado.`;
form.reset();
campos.forEach(c=>{c.classList.remove('success','error');c.removeAttribute('aria-invalid');delete c.dataset.tocado;const msgEl=document.getElementById('msg-'+c.name);if(msgEl)msgEl.textContent=''});
info.textContent='';
}else{
alerta.className='alert error';
alerta.textContent='Não foi possível enviar. Corrija os campos destacados em vermelho.';
const erro=form.querySelector('.error');
if(erro)erro.focus();
}
alerta.scrollIntoView({behavior:'smooth',block:'center'});
});
}
document.addEventListener('DOMContentLoaded',()=>{
iniciarMenu();
iniciarDoacoes();
iniciarCadastro();
});