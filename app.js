/**
 * Breast Cancer Treatment Decision Support System
 * 2025 Guidelines
 */

// =========================================
// Decision Data Structure
// =========================================
const decisionData = {
    // --- ROOT ---
    "root": {
        text: "乳がんのサブタイプを選択してください",
        options: [
            { text: "HR+ (Hormone Receptor Positive)", next: "hr_stage" },
            { text: "HER2+ (HER2 Positive)", next: "her2_stage" },
            { text: "TNBC (Triple Negative)", next: "tnbc_stage" }
        ]
    },

    // ==========================================
    // HR+ BRANCH
    // ==========================================
    "hr_stage": {
        text: "病期(ステージ)を選択してください",
        options: [
            { text: "早期乳がん (Early Stage)", next: "hr_early_node" },
            { text: "進行・転移性乳がん (Advanced/Metastatic)", next: "hr_adv_status" }
        ]
    },

    // --- HR+ Early ---
    "hr_early_node": {
        text: "リンパ節転移の状況 (N Status)",
        options: [
            { text: "Node Negative (リンパ節転移なし)", next: "hr_early_neg_meno" },
            { text: "Node Positive (1-3個)", next: "hr_early_pos_1_3" },
            { text: "Node Positive (4個以上)", next: "hr_early_pos_4plus" }
        ]
    },
    // Node Negative path (TailorX)
    "hr_early_neg_meno": {
        text: "閉経状況 (Menopausal Status)",
        options: [
            { text: "閉経前 (Premenopausal)", next: "hr_early_neg_pre_rs" },
            { text: "閉経後 (Postmenopausal)", next: "hr_early_neg_post_rs" }
        ]
    },
    "hr_early_neg_pre_rs": {
        text: "Oncotype DX 再発スコア (RS)",
        options: [
            { text: "RS 0-15", result: "Endocrine Therapy" },
            { text: "RS 16-25", result: "Endocrine Therapy (Some may benefit from Chemo)" },
            { text: "RS 26+", result: "Chemotherapy (TC) → Endocrine Therapy" }
        ]
    },
    "hr_early_neg_post_rs": {
        text: "Oncotype DX 再発スコア (RS)",
        options: [
            { text: "RS 0-25", result: "Endocrine Therapy" },
            { text: "RS 26+", result: "Chemotherapy (TC) → Endocrine Therapy" }
        ]
    },
    // Node Positive 1-3 path (RxPonder)
    "hr_early_pos_1_3": {
        text: "閉経状況 (Menopausal Status)",
        options: [
            { text: "閉経前 (Premenopausal)", next: "hr_early_pos_pre_rs" },
            { text: "閉経後 (Postmenopausal)", next: "hr_early_pos_post_rs" }
        ]
    },
    "hr_early_pos_pre_rs": {
        text: "Oncotype DX 再発スコア (RS)",
        options: [
            { text: "RS 0-25", result: "Chemotherapy vs OFS + AI → Endocrine Therapy" },
            { text: "RS 26+", result: "Chemotherapy (TC, ddAC-T) → Endocrine Therapy" }
        ]
    },
    "hr_early_pos_post_rs": {
        text: "Oncotype DX 再発スコア (RS)",
        options: [
            { text: "RS 0-25", result: "Endocrine Therapy" },
            { text: "RS 26+", result: "Chemotherapy (TC, ddAC-T) → Endocrine Therapy" }
        ]
    },
    // Node Positive 4+ path
    "hr_early_pos_4plus": {
        text: "推奨治療",
        result: "Chemotherapy (ddAC-T > TC) → Endocrine Therapy",
        note: "Select High Risk Patients: Add Abemaciclib (MonarchE), Ribociclib (NATALEE), or Olaparib (OlympiA) if eligible."
    },

    // --- HR+ Advanced ---
    "hr_adv_status": {
        text: "治療ラインと感受性",
        options: [
            { text: "De novo, または 術後ET終了後12ヶ月以上 (Endocrine Sensitive)", next: "hr_adv_sensitive" },
            { text: "術後ET中 または 終了後12ヶ月以内 (Endocrine Resistant)", next: "hr_adv_resistant" },
            { text: "既治療後の進行 (Later Lines)", next: "hr_adv_later" }
        ]
    },
    "hr_adv_sensitive": {
        text: "1次治療 (1st Line)",
        result: "CDK4/6 inhibitor + Endocrine Therapy",
        note: "Ribociclib (Monaleesa), Abemaciclib (Monarch), Palbociclib (Paloma)"
    },
    "hr_adv_resistant": {
        text: "遺伝子変異・バイオマーカー検査 (NGS)",
        options: [
            { text: "PIK3CA 変異あり", next: "hr_adv_pik3ca" },
            { text: "PIK3CA 野生型 (Wild Type)", result: "Palbociclib + Fulvestrant + Inavolisib (INAVO120)" }
        ]
    },
    "hr_adv_pik3ca": {
        text: "推奨治療",
        result: "Alpelisib + Endocrine Therapy (SOLAR1) or Capivasertib + ET (CAPItello)"
    },
    "hr_adv_later": {
        text: "特定の変異・HER2状態がありますか？",
        options: [
            { text: "ESR1 変異あり", result: "Elacestrant (EMERALD) or Imlunestrant" },
            { text: "gBRCA 1/2 変異あり", result: "PARPi (Olaparib, Talazoparib)" },
            { text: "PIK3CA/PTEN/AKT 変異あり", result: "Capivasertib + ET or Alpelisib + ET" },
            { text: "特になし / 上記治療後", next: "hr_adv_her2_status" }
        ]
    },
    "hr_adv_her2_status": {
        text: "HER2 低発現 (HER2-low) の状況",
        options: [
            { text: "HER2 Low (IHC 1+ or 2+/ISH-)", result: "T-DXd (DESTINY-Breast04) or Sacituzumab govitecan" },
            { text: "HER2 Ultralow", result: "T-DXd (DESTINY-Breast06) or Chemo" },
            { text: "HER2 Null (0)", result: "Sacituzumab govitecan (TROPICS-02) or Dato-DXd (Tropion) or Chemo" }
        ]
    },

    // ==========================================
    // HER2+ BRANCH
    // ==========================================
    "her2_stage": {
        text: "病期(ステージ)を選択してください",
        options: [
            { text: "早期乳がん (Early Stage)", next: "her2_early_size" },
            { text: "進行・転移性乳がん (Advanced/Metastatic)", next: "her2_adv_cns" }
        ]
    },
    "her2_early_size": {
        text: "腫瘍サイズとリンパ節転移",
        options: [
            { text: "< 2cm かつ Node Negative", next: "her2_early_small" },
            { text: "≧ 2cm または Node Positive", next: "her2_early_large" }
        ]
    },
    "her2_early_small": {
        text: "病理結果詳細 (pT1pN0)",
        result: "Surgery → Weekly TH x12 + Trastuzumab (1yr) (APT trial)",
        note: "Can consider T-DM1 per ATEMPT trial"
    },
    "her2_early_large": {
        text: "術前化学療法 (Neoadjuvant)",
        result: "Neoadjuvant Chemo + Trastuzumab + Pertuzumab",
        note: "Proceed to Surgery. If pCR: Complete 1yr HP. If Residual Disease (RD): T-DM1 (KATHERINE)."
    },
    "her2_adv_cns": {
        text: "中枢神経系(CNS)への転移状況",
        options: [
            { text: "CNS転移なし (No CNS involvement)", next: "her2_adv_no_cns" },
            { text: "CNS転移あり (Active CNS involvement)", next: "her2_adv_yes_cns" }
        ]
    },
    "her2_adv_no_cns": {
        text: "治療ライン",
        options: [
            { text: "1次治療 (1st Line)", result: "THP (Taxane + Trastuzumab + Pertuzumab) (CLEOPATRA)" },
            { text: "2次治療 (2nd Line)", result: "T-DXd (DESTINY-Breast03)" },
            { text: "3次治療以降", result: "Tucatinib + Trastuzumab + Capecitabine (HER2CLIMB) or T-DM1" }
        ]
    },
    "her2_adv_yes_cns": {
        text: "治療ライン",
        options: [
            { text: "1次治療 (1st Line)", result: "THP (Taxane + Trastuzumab + Pertuzumab)" },
            { text: "2次治療 (2nd Line)", result: "T-DXd (DESTINY-Breast12)" },
            { text: "3次治療以降", result: "Tucatinib + Trastuzumab + Capecitabine (HER2CLIMB)" }
        ]
    },

    // ==========================================
    // TNBC BRANCH
    // ==========================================
    "tnbc_stage": {
        text: "病期(ステージ)を選択してください",
        options: [
            { text: "早期乳がん (Early Stage)", next: "tnbc_early_size" },
            { text: "進行・転移性乳がん (Advanced/Metastatic)", next: "tnbc_adv_pdl1" }
        ]
    },
    "tnbc_early_size": {
        text: "腫瘍サイズとリンパ節転移",
        options: [
            { text: "< 2cm かつ Node Negative", result: "Surgery → Chemo (TC etc.)" },
            { text: "≧ 2cm または Node Positive", next: "tnbc_early_neoadj" }
        ]
    },
    "tnbc_early_neoadj": {
        text: "術前療法 (Keynote 522)",
        result: "Neoadjuvant Chemo + Pembrolizumab → Surgery",
        note: "If pCR: Cont. Pembro. If RD: Pembro (+ Capecitabine) or Olaparib if gBRCA+."
    },
    "tnbc_adv_pdl1": {
        text: "PD-L1 発現状況 (CPS score)",
        options: [
            { text: "PD-L1 Positive (CPS > 10)", result: "Pembrolizumab + Chemotherapy (Keynote 355)" },
            { text: "PD-L1 Negative", next: "tnbc_adv_brca" }
        ]
    },
    "tnbc_adv_brca": {
        text: "gBRCA 変異の有無",
        options: [
            { text: "gBRCA 1/2 Mutation Positive", result: "PARP Inhibitor (Olaparib, Talazoparib)" },
            { text: "No Mutation", next: "tnbc_adv_her2" }
        ]
    },
    "tnbc_adv_her2": {
        text: "HER2 低発現 (HER2-low) の状況",
        options: [
            { text: "HER2 Low (IHC 1+ or 2+/ISH-)", result: "Chemo (1st line) → T-DXd (DESTINY-Breast04)" },
            { text: "HER2 Null (0)", result: "Chemo (1st line) → Sacituzumab govitecan (ASCENT)" }
        ]
    }
};

// =========================================
// Application State
// =========================================
let historyStack = [];

// =========================================
// DOM Elements
// =========================================
const elements = {
    startScreen: document.getElementById('start-screen'),
    decisionScreen: document.getElementById('decision-screen'),
    resultScreen: document.getElementById('result-screen'),

    // Existing elements mapped to new logic
    questionTitle: document.getElementById('question-title'),
    optionsContainer: document.getElementById('options-container'),
    treatmentPathway: document.getElementById('treatment-pathway'),
    additionalNotes: document.getElementById('additional-notes'),
    breadcrumb: document.getElementById('breadcrumb'),
    backBtn: document.getElementById('back-btn'),
    resultBackBtn: document.getElementById('result-back-btn'),
    restartBtn: document.getElementById('restart-btn'),
    stepIndicator: document.getElementById('step-indicator'),
    clinicalTrials: document.getElementById('clinical-trials'),
    summaryList: document.getElementById('summary-list')
};

// =========================================
// Screen Management
// =========================================
function showScreen(screen) {
    elements.startScreen.classList.remove('active');
    elements.decisionScreen.classList.remove('active');
    elements.resultScreen.classList.remove('active');

    if (screen === 'decision') {
        elements.decisionScreen.classList.add('active');
    } else if (screen === 'result') {
        elements.resultScreen.classList.add('active');
    }
}

// =========================================
// Render Logic
// =========================================
function renderCard(nodeId) {
    const node = decisionData[nodeId];

    // Error handling
    if (!node) {
        console.error("Node not found:", nodeId);
        return;
    }

    // Is this a result node?
    if (node.result) {
        showResult(node);
        return;
    }

    // It's a question node
    showScreen('decision');

    // Reset any previous views
    elements.questionTitle.textContent = node.text;
    elements.stepIndicator.textContent = `Step ${historyStack.length + 1}`;

    // Clear options
    elements.optionsContainer.innerHTML = '';

    node.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn'; // Using existing CSS class
        btn.innerHTML = `<div class="option-main">${option.text}</div>`;

        if (option.result) {
            // Option leads directly to a result
            btn.onclick = () => {
                historyStack.push({ nodeId: nodeId, text: option.text });
                updateBreadcrumb();
                showResult({ result: option.result, note: option.note });
            };
        } else {
            // Option leads to next question
            btn.onclick = () => {
                historyStack.push({ nodeId: nodeId, text: option.text });
                updateBreadcrumb();
                renderCard(option.next);
            };
        }
        elements.optionsContainer.appendChild(btn);
    });

    updateBreadcrumb();
}

function showResult(node) {
    showScreen('result');

    // Clear previous result content
    elements.treatmentPathway.innerHTML = '';

    // Render result as a simple card since structure changed from array to string
    const resultHtml = `
        <div class="pathway-step">
            <div class="step-content">
                <div class="step-title" style="font-size: 1.2rem; color: var(--primary-color);">Recommended Treatment</div>
                <div class="step-desc" style="font-size: 1.1rem; margin-top: 8px;">${node.result}</div>
            </div>
        </div>
    `;
    elements.treatmentPathway.innerHTML = resultHtml;

    // Render notes
    if (node.note) {
        elements.additionalNotes.innerHTML = `<p>${node.note}</p>`;
        elements.additionalNotes.style.display = 'block';
    } else {
        elements.additionalNotes.style.display = 'none';
    }

    // Hide trials/summary lists if not used in new data structure
    if (elements.clinicalTrials) elements.clinicalTrials.style.display = 'none';
    if (elements.summaryList) {
        // Simple summary
        let summaryHtml = '';
        historyStack.forEach(item => {
            summaryHtml += `<span class="summary-item">${item.text}</span>`;
        });
        elements.summaryList.innerHTML = summaryHtml;
    }
}

function updateBreadcrumb() {
    let html = '';
    // Always start with 'Start' or 'Root' conceptually
    html += `<span class="breadcrumb-item" onclick="resetApp()" style="cursor:pointer;">Start</span>`;

    historyStack.forEach(item => {
        html += `<span class="breadcrumb-item">${item.text}</span>`;
    });

    elements.breadcrumb.innerHTML = html;
}

function goBack() {
    if (historyStack.length === 0) {
        // Already at root, do nothing or confirm reset
        return;
    }

    // Pop the last choice
    const lastStep = historyStack.pop();

    // If stack is empty after pop, we are back to root
    if (historyStack.length === 0) {
        renderCard('root');
    } else {
        // The *new* last item tells us where we came from, but we actually want to render
        // the node we were AT when we made the *last* choice.
        // Wait, 'lastStep' contains {nodeId: 'previousNodeId', text: 'Choice made'}
        // So we should render lastStep.nodeId.
        renderCard(lastStep.nodeId);
    }
}

function resetApp() {
    historyStack = [];
    renderCard('root');
}

// =========================================
// Initialization
// =========================================
function init() {
    // Hide start screen, use decision screen for everything
    elements.startScreen.style.display = 'none';
    elements.decisionScreen.classList.add('active');

    // Bind global buttons
    if (elements.backBtn) elements.backBtn.addEventListener('click', goBack);
    if (elements.resultBackBtn) elements.resultBackBtn.addEventListener('click', goBack);
    if (elements.restartBtn) elements.restartBtn.addEventListener('click', resetApp);

    // Initial Render
    renderCard('root');
}

// Start
document.addEventListener('DOMContentLoaded', init);
