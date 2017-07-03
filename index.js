import { create } from 'rung-sdk';
import { OneOf, Double } from 'rung-sdk/dist/types';
import Bluebird from 'bluebird';
import agent from 'superagent';
import promisifyAgent from 'superagent-promise';
import { path, lt, gt, pipe, cond, equals, contains, __, T, concat } from 'ramda';
import { JSDOM } from 'jsdom';

const request = promisifyAgent(agent, Bluebird);

function render(card_titulo, col1_tit, col1_val, col2_tit, col2_val) {

    return (
		<div style="width:165px; height:125px; box-sizing: border-box; padding: 1px; overflow: hidden; position: absolute; margin: -12px 0 0 -10px; ">

			<div style="width:100%; height:20px; background-color: rgba(255,255,255,0.5); position: relative; z-index:1; ">
				<div style="background: url('http://www.pbanimado.com.br/rung/icon-arroz.png') no-repeat center center; background-size: 100%; width:50px; height: 50px; position: absolute; z-index:2; margin: -10px 0 0 54px; border: 3px solid #FFF; -webkit-border-radius: 50%; -moz-border-radius: 50%; border-radius: 50%;"></div>
			</div>

			<div style="font-size:11px; width:96%; line-height: 1.3; text-align: center; padding: 30px 2% 0; ">
				<p style="margin:0; padding: 0; ">{card_titulo}</p>
				<p style="margin:0; padding: 0; ">{col1_tit}: {col1_val}</p>
				<p style="margin:0; padding: 0; ">{col2_tit}: <strong style="text-decoration: underline; ">{col2_val}</strong></p>
			</div>
		</div>
	);


}

function nodeListToArray(dom) {
    return Array.prototype.slice.call(dom, 0);
}

function returnSelector(type, row, cell) {
	const selector = '#content .middle .tables .cotacao:nth-child(1) .table-content table ';
	const selectorTable = type == 'title'
		? `thead > tr > th:nth-child(${cell})`
		: `tbody > tr:nth-child(${row}) > td:nth-child(${cell})`;
	return selector + selectorTable;
}

function main(context, done) {

	const { fonte, condicao, valor } = context.params;

	// variáveis padrão
	var fonte_titulo = '';
	var fonte_link = 'https://www.noticiasagricolas.com.br/cotacoes/arroz/';
	var fonte_data = '#content .middle .tables .cotacao:nth-child(1) .info .fechamento';

	// variáveis das colunas de busca
	var coluna1_titulo = returnSelector('title', '', '1');
	var coluna1_result = returnSelector('result', '1', '1');

	var coluna2_titulo = returnSelector('title', '', '2');
	var coluna2_result = returnSelector('result', '1', '2');

	var coluna3_titulo = returnSelector('title', '', '3');
	var coluna3_result = returnSelector('result', '1', '3');

	// definindo os valores padrão de exibição
	var fonte_coluna_tit 	= coluna1_titulo;
	var fonte_coluna_res 	= coluna1_result;

	var fonte_preco_tit 	= coluna2_titulo;
	var fonte_preco_res 	= coluna2_result;

	var fonte_variacao_tit 	= coluna3_titulo;
	var fonte_variacao_res 	= coluna3_result;

	// definindo o link de conexão
	const server = pipe(
		cond([
			[contains(__, ['Mercado Físico - Capivari do Sul/RS (Coripil)', 'Mercado Físico - Itaqui/RS (Sindicato Rural)', 'Mercado Físico - Pelotas/RS (Cereagro)', 'Mercado Físico - Média Rio Grande do Sul (Clicmercado)', 'Mercado Físico - Rio do Sul/SC (Cravil)', 'Mercado Físico - Sorriso/MT (Sindicato Rural)', 'Mercado Físico - Oeste da Bahia (AIBA)', 'Mercado Físico - Guaratinguetá/SP (IEA)', 'Mercado Físico - Pindamonhangaba/SP (IEA)']), () => 'arroz-mercado-fisico'],
			[contains(__, ['Beneficiado SP - Agulhinha Tipo 1', 'Beneficiado SP - Agulhinha Tipo 2']), () => 'arroz-beneficiado-sao-paulo'],
			[equals('Arroz em Casca - Esalq/Senar-RS'), () => 'arroz-em-casca-esalq-bbm'],
			[equals('Atacado Média PR - Agulhinha em casca'), () => 'arroz-atacado-media-pr'],
			[contains(__, ['Agulhinha Irrigado - Alegrete/RS', 'Agulhinha Irrigado - Cachoeira do Sul/RS', 'Agulhinha Irrigado - Dom Pedrito/RS', 'Agulhinha Irrigado - Santa Maria/RS', 'Agulhinha Irrigado - Uruguaiana/RS', 'Agulhinha Irrigado - Jaraguá do Sul/SC', 'Agulhinha Irrigado - Sul Catarinense/SC', 'Agulhinha Irrigado - Turvo/SC']), () => 'arroz-agulhinha-irrigado-mercado-fisico'],
			[contains(__, ['Longo Fino - Gurupi/TO', 'Longo Fino - Rio Verde/GO', 'Longo Fino - Sinop/MT']), () => 'arroz-longo-fino-mercado-fisico'],
			[contains(__, ['Beneficiado Tipo 1 - Porto Alegre/RS', 'Beneficiado Tipo 1 - São Paulo/SP', 'Beneficiado Tipo 1 - Sul Catarinense/SC']), () => 'arroz-beneficiado-tipo-1'],
			[T, () => '']
		]),
		concat(fonte_link)
	)(fonte);

	// definindo os valores padrão
	switch (fonte) {

    	case 'Mercado Físico - Capivari do Sul/RS (Coripil)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '1', '1');
			fonte_preco_res 	= returnSelector('result', '1', '2');
			fonte_variacao_res 	= returnSelector('result', '1', '3');
    		break;

    	case 'Mercado Físico - Itaqui/RS (Sindicato Rural)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '2', '1');
			fonte_preco_res 	= returnSelector('result', '2', '2');
			fonte_variacao_res 	= returnSelector('result', '2', '3');
    		break;

    	case 'Mercado Físico - Pelotas/RS (Cereagro)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '3', '1');
			fonte_preco_res 	= returnSelector('result', '3', '2');
			fonte_variacao_res 	= returnSelector('result', '3', '3');
    		break;

    	case 'Mercado Físico - Média Rio Grande do Sul (Clicmercado)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '4', '1');
			fonte_preco_res 	= returnSelector('result', '4', '2');
			fonte_variacao_res 	= returnSelector('result', '4', '3');
    		break;

    	case 'Mercado Físico - Rio do Sul/SC (Cravil)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '5', '1');
			fonte_preco_res 	= returnSelector('result', '5', '2');
			fonte_variacao_res 	= returnSelector('result', '5', '3');
    		break;

    	case 'Mercado Físico - Sorriso/MT (Sindicato Rural)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '6', '1');
			fonte_preco_res 	= returnSelector('result', '6', '2');
			fonte_variacao_res 	= returnSelector('result', '6', '3');
    		break;

    	case 'Mercado Físico - Oeste da Bahia (AIBA)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '7', '1');
			fonte_preco_res 	= returnSelector('result', '7', '2');
			fonte_variacao_res 	= returnSelector('result', '7', '3');
    		break;

    	case 'Mercado Físico - Guaratinguetá/SP (IEA)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '8', '1');
			fonte_preco_res 	= returnSelector('result', '8', '2');
			fonte_variacao_res 	= returnSelector('result', '8', '3');
    		break;

    	case 'Mercado Físico - Pindamonhangaba/SP (IEA)':
    		fonte_titulo		= 'Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '9', '1');
			fonte_preco_res 	= returnSelector('result', '9', '2');
			fonte_variacao_res 	= returnSelector('result', '9', '3');
    		break;

		case 'Beneficiado SP - Agulhinha Tipo 1':
    		fonte_titulo		= 'Arroz Beneficiado - SP';
			fonte_coluna_res 	= returnSelector('result', '1', '1');
			fonte_preco_res 	= returnSelector('result', '1', '2');
			fonte_variacao_res 	= returnSelector('result', '1', '3');
    		break;

    	case 'Beneficiado SP - Agulhinha Tipo 2':
    		fonte_titulo		= 'Arroz Beneficiado - SP';
			fonte_coluna_res 	= returnSelector('result', '2', '1');
			fonte_preco_res 	= returnSelector('result', '2', '2');
			fonte_variacao_res 	= returnSelector('result', '2', '3');
    		break;

		case 'Arroz em Casca - Esalq/Senar-RS':
    		fonte_titulo		= 'Arroz em Casca - Esalq/Senar-RS';
			fonte_coluna_res 	= returnSelector('result', '1', '1');
			fonte_preco_res 	= returnSelector('result', '1', '2');
			fonte_variacao_res 	= returnSelector('result', '1', '3');
    		break;

		case 'Atacado Média PR - Agulhinha em casca':
			fonte_titulo		= 'Arroz Atacado - Média PR';
			fonte_coluna_res 	= returnSelector('result', '1', '1');
			fonte_preco_res 	= returnSelector('result', '1', '2');
			fonte_variacao_res 	= returnSelector('result', '1', '3');
			break;

		case 'Agulhinha Irrigado - Alegrete/RS':
			fonte_titulo		= 'Agulhinha Irrigado - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '1', '1');
			fonte_preco_res 	= returnSelector('result', '1', '2');
			fonte_variacao_res 	= returnSelector('result', '1', '3');
			break;

		case 'Agulhinha Irrigado - Cachoeira do Sul/RS':
			fonte_titulo		= 'Agulhinha Irrigado - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '2', '1');
			fonte_preco_res 	= returnSelector('result', '2', '2');
			fonte_variacao_res 	= returnSelector('result', '2', '3');
			break;

		case 'Agulhinha Irrigado - Dom Pedrito/RS':
			fonte_titulo		= 'Agulhinha Irrigado - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '3', '1');
			fonte_preco_res 	= returnSelector('result', '3', '2');
			fonte_variacao_res 	= returnSelector('result', '3', '3');
			break;

		case 'Agulhinha Irrigado - Santa Maria/RS':
			fonte_titulo		= 'Agulhinha Irrigado - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '4', '1');
			fonte_preco_res 	= returnSelector('result', '4', '2');
			fonte_variacao_res 	= returnSelector('result', '4', '3');
			break;

		case 'Agulhinha Irrigado - Uruguaiana/RS':
			fonte_titulo		= 'Agulhinha Irrigado - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '5', '1');
			fonte_preco_res 	= returnSelector('result', '5', '2');
			fonte_variacao_res 	= returnSelector('result', '5', '3');
			break;

		case 'Agulhinha Irrigado - Jaraguá do Sul/SC':
			fonte_titulo		= 'Agulhinha Irrigado - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '6', '1');
			fonte_preco_res 	= returnSelector('result', '6', '2');
			fonte_variacao_res 	= returnSelector('result', '6', '3');
			break;

		case 'Agulhinha Irrigado - Sul Catarinense/SC':
			fonte_titulo		= 'Agulhinha Irrigado - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '7', '1');
			fonte_preco_res 	= returnSelector('result', '7', '2');
			fonte_variacao_res 	= returnSelector('result', '7', '3');
			break;

		case 'Agulhinha Irrigado - Turvo/SC':
			fonte_titulo		= 'Agulhinha Irrigado - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '8', '1');
			fonte_preco_res 	= returnSelector('result', '8', '2');
			fonte_variacao_res 	= returnSelector('result', '8', '3');
			break;

		case 'Longo Fino - Gurupi/TO':
			fonte_titulo		= 'Longo Fino - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '1', '1');
			fonte_preco_res 	= returnSelector('result', '1', '2');
			fonte_variacao_res 	= returnSelector('result', '1', '3');
			break;

		case 'Longo Fino - Rio Verde/GO':
			fonte_titulo		= 'Longo Fino - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '2', '1');
			fonte_preco_res 	= returnSelector('result', '2', '2');
			fonte_variacao_res 	= returnSelector('result', '2', '3');
			break;

		case 'Longo Fino - Sinop/MT':
			fonte_titulo		= 'Longo Fino - Mercado Físico';
			fonte_coluna_res 	= returnSelector('result', '3', '1');
			fonte_preco_res 	= returnSelector('result', '3', '2');
			fonte_variacao_res 	= returnSelector('result', '3', '3');
			break;

		case "Beneficiado Tipo 1 - Porto Alegre/RS":
			fonte_titulo		= 'Beneficiado Tipo 1';
			fonte_coluna_res 	= returnSelector('result', '1', '1');
			fonte_preco_res 	= returnSelector('result', '1', '2');
			fonte_variacao_res 	= returnSelector('result', '1', '3');
			break;

		case "Beneficiado Tipo 1 - São Paulo/SP":
			fonte_titulo		= 'Beneficiado Tipo 1';
			fonte_coluna_res 	= returnSelector('result', '2', '1');
			fonte_preco_res 	= returnSelector('result', '2', '2');
			fonte_variacao_res 	= returnSelector('result', '2', '3');
			break;

		case "Beneficiado Tipo 1 - Sul Catarinense/SC":
			fonte_titulo		= 'Beneficiado Tipo 1';
			fonte_coluna_res 	= returnSelector('result', '3', '1');
			fonte_preco_res 	= returnSelector('result', '3', '2');
			fonte_variacao_res 	= returnSelector('result', '3', '3');
			break;


	}

	// Obter todo o HTML do site em modo texto
	return request.get(server).then(({ text }) => {

		// Virtualizar o DOM do texto
		const { window } = new JSDOM(text);

		// Converter os dados da tabela para uma lista
		const retorno_data 			= window.document.querySelector(fonte_data).innerHTML;
		const retorno_coluna_tit 	= window.document.querySelector(fonte_coluna_tit).innerHTML;
		const retorno_coluna_res 	= window.document.querySelector(fonte_coluna_res).innerHTML;
		const retorno_preco_tit 	= window.document.querySelector(fonte_preco_tit).innerHTML;
		const retorno_preco_res 	= window.document.querySelector(fonte_preco_res).innerHTML;
		const retorno_variacao_tit 	= window.document.querySelector(fonte_variacao_tit).innerHTML;
		const retorno_variacao_res 	= window.document.querySelector(fonte_variacao_res).innerHTML;

		// arrumando o valor que vem do HTML
		var valorHTML = parseFloat(retorno_preco_res.replace(',', '.'));

		// arrumando o valor que é digitado
		var valorFormatado = valor.toFixed(2);

		// formatando comentario
		var comentario = "<p style='font-weight: bold; font-size: 18px; '>Cotação de Arroz</p><p style='font-weight: bold; font-size: 18px; '>" + fonte_titulo + "</p><hr><p style='font-size: 16px; font-weight: bold; '>" + retorno_data + "</p><p style='font-size: 16px; '><span style='font-weight: bold; '>" + retorno_coluna_tit + "</span>: " + retorno_coluna_res + "</p><p style='font-size: 16px; '><span style='font-weight: bold; '>" + retorno_preco_tit + "</span>: " + retorno_preco_res + "</p><p style='font-size: 16px; '><span style='font-weight: bold; '>" + retorno_variacao_tit + "</span>: " + retorno_variacao_res + "</p><br><p style='font-size: 16px; '>Fonte: Portal Notícias Agrícolas</p><a href='" + server + "' target='_blank' style='font-size: 14px; font-style: italic; '>http://www.noticiasagricolas.com.br</a>";

		console.log(comentario);

		// verificação de maior OU menor
		if ((condicao == 'maior' && valorHTML > valor) || (condicao == 'menor' && valorHTML < valor)) {

			done({
				alerts: {
					[`arroz${fonte_titulo}`] : {
						title: fonte_titulo,
						content: render(fonte_titulo, retorno_coluna_tit, retorno_coluna_res, retorno_preco_tit, retorno_preco_res),
						comment: comentario
					}
				}
			});

		} else {

			done({ alerts: {} });

		}
	})
	.catch(() => done({ alerts: {} }));

}

const lista_fontes = [

	'Mercado Físico - Capivari do Sul/RS (Coripil)',
	'Mercado Físico - Itaqui/RS (Sindicato Rural)',
	'Mercado Físico - Pelotas/RS (Cereagro)',
	'Mercado Físico - Média Rio Grande do Sul (Clicmercado)',
	'Mercado Físico - Rio do Sul/SC (Cravil)',
	'Mercado Físico - Sorriso/MT (Sindicato Rural)',
	'Mercado Físico - Oeste da Bahia (AIBA)',
	'Mercado Físico - Guaratinguetá/SP (IEA)',
	'Mercado Físico - Pindamonhangaba/SP (IEA)',
	'Beneficiado SP - Agulhinha Tipo 1',
	'Beneficiado SP - Agulhinha Tipo 2',
	'Arroz em Casca - Esalq/Senar-RS',
	'Atacado Média PR - Agulhinha em casca',
	'Agulhinha Irrigado - Alegrete/RS',
	'Agulhinha Irrigado - Cachoeira do Sul/RS',
	'Agulhinha Irrigado - Dom Pedrito/RS',
	'Agulhinha Irrigado - Santa Maria/RS',
	'Agulhinha Irrigado - Uruguaiana/RS',
	'Agulhinha Irrigado - Jaraguá do Sul/SC',
	'Agulhinha Irrigado - Sul Catarinense/SC',
	'Agulhinha Irrigado - Turvo/SC',
	'Longo Fino - Gurupi/TO',
	'Longo Fino - Rio Verde/GO',
	'Longo Fino - Sinop/MT',
	'Beneficiado Tipo 1 - Porto Alegre/RS',
	'Beneficiado Tipo 1 - São Paulo/SP',
	'Beneficiado Tipo 1 - Sul Catarinense/SC'

];

const params = {
    fonte: {
        description: _('Informe a fonte que você deseja ser informado: '),
        type: OneOf(lista_fontes),
		required: true
    },
	condicao: {
		description: _('Informe a condição (maior, menor): '),
		type: OneOf(['maior', 'menor']),
		default: 'maior'
	},
	valor: {
		description: _('Informe o valor em reais para verificação: '),
		type: Double,
		required: true
	}
};

export default create(main, {
    params,
    primaryKey: true,
    title: _("Cotação Arroz"),
    description: _("Acompanhe a cotação do arroz em diversas praças."),
	preview: render('Arroz - Mercado Físico', 'Praça', 'Oeste da Bahia (AIBA)', 'Preço (R$/sc 50 kg)', '47,00')
});