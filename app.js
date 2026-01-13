/**
 * Breast Cancer Treatment Decision Support System
 * 2025 Guidelines - Based on ASCO, ESMO, SABCS
 */

// =========================================
// Decision Tree Data Structure
// =========================================

const decisionTrees = {
    // =========================================
    // TNBC (Triple Negative Breast Cancer)
    // =========================================
    tnbc: {
        name: 'トリプルネガティブ乳がん (TNBC)',
        color: '#8b5cf6',
        firstQuestion: 'stage',
        questions: {
            stage: {
                title: '病期を選択してください',
                description: '早期（手術可能）か進行（転移性）かを判断します',
                options: [
                    { id: 'early', label: '早期 TNBC', sub: '手術可能な局所進行まで', next: 'early_size' },
                    { id: 'advanced', label: '進行 TNBC', sub: '転移性または手術不能', next: 'advanced_pdl1' }
                ]
            },
            early_size: {
                title: '腫瘍径とリンパ節転移の状態',
                description: '術前の画像診断・生検結果に基づいて選択してください',
                options: [
                    { id: 'small_node_neg', label: '2cm未満 かつ リンパ節陰性', sub: 'cT1N0', next: 'early_small_size' },
                    { id: 'large_or_node_pos', label: '2cm以上 または リンパ節陽性', sub: 'cT2以上 または cN+', next: 'early_large' }
                ]
            },
            early_small_size: {
                title: '腫瘍径の詳細',
                description: '',
                options: [
                    { id: 'under_1cm', label: '1cm未満', sub: 'T1a/T1b', next: 'result_early_small_under1cm' },
                    { id: '1_to_2cm', label: '1-2cm', sub: 'T1c', next: 'result_early_small_1to2cm' }
                ]
            },
            early_large: {
                title: '術前化学療法後の病理学的効果',
                description: 'TC-AC + ペムブロリズマブによる術前療法後の手術病理結果',
                options: [
                    { id: 'pcr', label: 'pCR (病理学的完全奏効)', sub: '残存腫瘍なし', next: 'result_early_pcr' },
                    { id: 'rd', label: 'RD (残存腫瘍あり)', sub: '残存病変あり', next: 'early_rd_brca' }
                ]
            },
            early_rd_brca: {
                title: 'BRCA遺伝子変異の状態',
                description: 'Germline BRCA検査結果を選択してください',
                options: [
                    { id: 'brca_wt', label: 'BRCA野生型 (BRCAwt)', sub: '変異なし', next: 'result_early_rd_brcawt' },
                    { id: 'brca_mut', label: 'gBRCA変異陽性', sub: 'BRCA1/2変異あり', next: 'result_early_rd_brcamut' }
                ]
            },
            advanced_pdl1: {
                title: 'PDL1発現状態',
                description: '22C3抗体によるCPS（Combined Positive Score）を確認してください',
                options: [
                    { id: 'pdl1_pos', label: 'PDL1陽性 (CPS ≥10)', sub: '免疫療法適応', next: 'result_advanced_pdl1_pos' },
                    { id: 'pdl1_neg', label: 'PDL1陰性 (CPS <10)', sub: '', next: 'advanced_brca' }
                ]
            },
            advanced_brca: {
                title: 'gBRCA変異の状態',
                description: 'Germline BRCA1/2変異検査結果',
                options: [
                    { id: 'brca_mut', label: 'gBRCA変異陽性', sub: 'PARP阻害剤適応', next: 'result_advanced_brca_mut' },
                    { id: 'brca_wt', label: 'gBRCA変異なし', sub: '', next: 'advanced_her2' }
                ]
            },
            advanced_her2: {
                title: 'HER2発現レベル',
                description: 'HER2-low/ultralow判定（IHC 1+ または IHC 2+/ISH-）',
                options: [
                    { id: 'her2_low', label: 'HER2-low (IHC 1-2+)', sub: 'ADC適応の可能性', next: 'result_advanced_her2_low' },
                    { id: 'her2_0', label: 'HER2 0', sub: '', next: 'result_advanced_her2_0' }
                ]
            }
        },
        results: {
            result_early_small_under1cm: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後観察 vs 化学療法', desc: 'T1aは観察、リスクに応じて化学療法を検討' }
                ],
                trials: [],
                notes: 'T1a（5mm以下）の場合は観察も選択肢。腫瘍グレードや増殖能も考慮してください。'
            },
            result_early_small_1to2cm: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後化学療法', desc: 'アントラサイクリン±タキサンベース' }
                ],
                trials: [],
                notes: '1-2cmのTNBCは化学療法の適応となることが多いです。'
            },
            result_early_pcr: {
                pathway: [
                    { title: '術前化学療法', desc: 'TC-AC + ペムブロリズマブ (Keynote-522)', trial: 'Keynote-522' },
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後ペムブロリズマブ', desc: '1年間のペムブロリズマブ継続' }
                ],
                trials: ['Keynote-522'],
                notes: 'pCR達成後もペムブロリズマブを1年間継続することでDFS改善が示されています。'
            },
            result_early_rd_brcawt: {
                pathway: [
                    { title: '術前化学療法', desc: 'TC-AC + ペムブロリズマブ (Keynote-522)', trial: 'Keynote-522' },
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後ペムブロリズマブ + カペシタビン', desc: 'ペムブロリズマブ継続 + カペシタビン追加を検討', trial: 'CreateX' }
                ],
                trials: ['Keynote-522', 'CreateX'],
                notes: 'BRCAwt + RDの場合、カペシタビン追加の有効性が示されています（CreateX試験）。'
            },
            result_early_rd_brcamut: {
                pathway: [
                    { title: '術前化学療法', desc: 'TC-AC + ペムブロリズマブ (Keynote-522)', trial: 'Keynote-522' },
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後ペムブロリズマブ + オラパリブ', desc: 'オラパリブ1年間を検討', trial: 'OlympiA' }
                ],
                trials: ['Keynote-522', 'OlympiA'],
                notes: 'gBRCA変異陽性 + RDの場合、オラパリブ追加でiDFS改善が示されています（OlympiA試験）。'
            },
            result_advanced_pdl1_pos: {
                pathway: [
                    { title: 'ペムブロリズマブ + 化学療法', desc: 'nab-パクリタキセル、パクリタキセル、またはGem/Carbベース', trial: 'Keynote-355' }
                ],
                trials: ['Keynote-355', 'ASCENT-04 (Saci+pembro)'],
                notes: 'PDL1 CPS≥10の1L治療として承認されています。ASCENT-04でSaci+pembroも検討中。'
            },
            result_advanced_brca_mut: {
                pathway: [
                    { title: 'PARP阻害剤', desc: 'オラパリブまたはタラゾパリブ', trial: 'OlympiAD, EMBRACA' }
                ],
                trials: ['OlympiAD', 'EMBRACA'],
                notes: 'gBRCA変異陽性の進行TNBCに対してPARP阻害剤が有効です。'
            },
            result_advanced_her2_low: {
                pathway: [
                    { title: '化学療法', desc: '標準化学療法' },
                    { title: 'T-DXd（2L以降）', desc: 'トラスツズマブ デルクステカン', trial: 'DESTINY-Breast04' },
                    { title: 'サシツズマブ ゴビテカン（2L以降）', desc: 'ADC療法', trial: 'ASCENT' }
                ],
                trials: ['DESTINY-Breast04', 'ASCENT'],
                notes: 'HER2-lowの場合、T-DXdが有効性を示しています。約60%のDB04患者はHR-/HER2-lowでした。'
            },
            result_advanced_her2_0: {
                pathway: [
                    { title: '化学療法', desc: '標準化学療法' },
                    { title: 'サシツズマブ ゴビテカン（2L以降）', desc: 'ADC療法', trial: 'ASCENT' }
                ],
                trials: ['ASCENT'],
                notes: 'HER2 0の場合でもサシツズマブ ゴビテカンは有効です。'
            }
        }
    },

    // =========================================
    // HER2+ Breast Cancer
    // =========================================
    her2: {
        name: 'HER2陽性乳がん',
        color: '#0ea5e9',
        firstQuestion: 'stage',
        questions: {
            stage: {
                title: '病期を選択してください',
                description: '',
                options: [
                    { id: 'early', label: '早期 HER2+', sub: '手術可能', next: 'early_size' },
                    { id: 'advanced', label: '進行 HER2+', sub: '転移性または手術不能', next: 'advanced_cns' }
                ]
            },
            early_size: {
                title: '腫瘍径とリンパ節転移の状態',
                description: '',
                options: [
                    { id: 'small_node_neg', label: '2cm未満 かつ リンパ節陰性', sub: 'cT1N0', next: 'early_small_detail' },
                    { id: 'large_or_node_pos', label: '2cm以上 または リンパ節陽性', sub: 'cT2以上 または cN+', next: 'early_large_response' }
                ]
            },
            early_small_detail: {
                title: '腫瘍の詳細',
                description: '',
                options: [
                    { id: 'pt1pn0', label: 'pT1pN0', sub: '1cm以下、リンパ節転移なし', next: 'result_early_small_pt1' },
                    { id: 'pt2_pn1', label: 'pT2 または pN1+', sub: '1cm超 または リンパ節転移あり', next: 'result_early_small_larger' }
                ]
            },
            early_large_response: {
                title: '術前化学療法後の病理学的効果',
                description: 'ペルツズマブ＋トラスツズマブ＋化学療法による術前療法後',
                options: [
                    { id: 'pcr', label: 'pCR (病理学的完全奏効)', sub: '残存腫瘍なし', next: 'early_pcr_hr' },
                    { id: 'rd', label: 'RD (残存腫瘍あり)', sub: '残存病変あり', next: 'early_rd_hr' }
                ]
            },
            early_pcr_hr: {
                title: 'ホルモン受容体の状態',
                description: '',
                options: [
                    { id: 'hr_any', label: 'HR+ または HR-', sub: '', next: 'result_early_pcr' }
                ]
            },
            early_rd_hr: {
                title: 'ホルモン受容体・リンパ節の状態',
                description: '術後治療の選択に影響します',
                options: [
                    { id: 'standard', label: '標準リスク', sub: '', next: 'result_early_rd_standard' },
                    { id: 'high_risk', label: '高リスク (HR+/N+など)', sub: 'ネラチニブ追加を検討', next: 'result_early_rd_high' }
                ]
            },
            advanced_cns: {
                title: '中枢神経系（CNS）転移の有無',
                description: '脳転移の状態を確認してください',
                options: [
                    { id: 'no_cns', label: 'CNS転移なし', sub: '', next: 'advanced_line' },
                    { id: 'cns', label: 'CNS転移あり', sub: '脳転移、髄膜播種', next: 'advanced_cns_line' }
                ]
            },
            advanced_line: {
                title: '治療ライン',
                description: '',
                options: [
                    { id: 'first', label: '1次治療', sub: '未治療', next: 'result_advanced_1l' },
                    { id: 'second', label: '2次治療以降', sub: 'THP後進行', next: 'result_advanced_2l' }
                ]
            },
            advanced_cns_line: {
                title: '治療ライン',
                description: '',
                options: [
                    { id: 'first', label: '1次治療', sub: '', next: 'result_advanced_cns_1l' },
                    { id: 'second', label: '2次治療以降', sub: '', next: 'result_advanced_cns_2l' }
                ]
            }
        },
        results: {
            result_early_small_pt1: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後パクリタキセル+トラスツズマブ (週1x12回)', desc: 'APT療法', trial: 'Tolaney NEJM 2015' },
                    { title: 'トラスツズマブ1年間', desc: '術後HER2標的治療継続' }
                ],
                trials: ['Tolaney NEJM 2015', 'ATEMPT (T-DM1も検討可)'],
                notes: '低リスクpT1pN0の場合、APT療法で良好な予後が得られています。'
            },
            result_early_small_larger: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後化学療法 + トラスツズマブ ± ペルツズマブ', desc: 'AC-THP または TCHPなど', trial: 'Aphinity' },
                    { title: 'HER2標的治療1年間', desc: 'トラスツズマブ±ペルツズマブ継続' }
                ],
                trials: ['Aphinity'],
                notes: 'pT2/pN1+の場合はペルツズマブ追加を検討してください。'
            },
            result_early_pcr: {
                pathway: [
                    { title: '術前化学療法', desc: 'ペルツズマブ+トラスツズマブ+化学療法', trial: 'NeoSphere/Aphinity' },
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: 'トラスツズマブ±ペルツズマブ 1年間', desc: '術後HER2標的治療継続' }
                ],
                trials: ['NeoSphere', 'Aphinity', 'TRAIN2'],
                notes: 'pCR達成後はトラスツズマブ±ペルツズマブを継続します。内分泌療法も適応に応じて追加。'
            },
            result_early_rd_standard: {
                pathway: [
                    { title: '術前化学療法', desc: 'ペルツズマブ+トラスツズマブ+化学療法' },
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: 'T-DM1 1年間', desc: 'エムタンシンに切り替え', trial: 'KATHERINE' }
                ],
                trials: ['KATHERINE', 'DB05 (T-DXd vs T-DM1検討中)'],
                notes: 'RDの場合はT-DM1への切り替えでiDFS改善が示されています（KATHERINE試験）。'
            },
            result_early_rd_high: {
                pathway: [
                    { title: '術前化学療法', desc: 'ペルツズマブ+トラスツズマブ+化学療法' },
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: 'T-DM1 1年間', desc: 'エムタンシンに切り替え', trial: 'KATHERINE' },
                    { title: 'ネラチニブ1年間を検討', desc: 'HR+/N+の場合に検討', trial: 'ExteNET' }
                ],
                trials: ['KATHERINE', 'ExteNET'],
                notes: 'HR+かつN+の高リスク患者ではネラチニブ追加を検討してください（ExteNET試験）。'
            },
            result_advanced_1l: {
                pathway: [
                    { title: 'THP → HP', desc: 'ペルツズマブ+トラスツズマブ+タキサン', trial: 'CLEOPATRA' },
                    { title: '維持療法', desc: 'HP継続（HR+の場合は内分泌療法追加を検討）' }
                ],
                trials: ['CLEOPATRA', 'DB09 (T-DXd+P vs THP)', 'PATINA (HR+にパルボ追加)'],
                notes: '1L標準治療はTHP（Cleopatra試験）。T-DXd+Pの検討も進行中（DB09）。'
            },
            result_advanced_2l: {
                pathway: [
                    { title: 'T-DXd', desc: 'トラスツズマブ デルクステカン', trial: 'DESTINY-Breast03' },
                    { title: '3L以降: Tucatinib+Trastuzumab+Capecitabine', desc: 'HER2CLIMB', trial: 'HER2CLIMB' },
                    { title: 'その他の選択肢', desc: 'T-DM1、ネラチニブ+カペシタビン、ラパチニブ+カペシタビンなど' }
                ],
                trials: ['DESTINY-Breast03', 'HER2CLIMB', 'EMILIA', 'NALA', 'SOPHIA'],
                notes: '2L以降はT-DXdが標準。その後はTucatinib併用療法やT-DM1を検討。'
            },
            result_advanced_cns_1l: {
                pathway: [
                    { title: 'THP → HP', desc: 'ペルツズマブ+トラスツズマブ+タキサン', trial: 'CLEOPATRA' },
                    { title: '脳転移に対する局所治療', desc: '放射線治療、手術など併用' }
                ],
                trials: ['CLEOPATRA'],
                notes: 'CNS転移があっても全身治療の基本は変わりません。局所治療を適切に組み合わせてください。'
            },
            result_advanced_cns_2l: {
                pathway: [
                    { title: 'T-DXd', desc: 'CNS活性あり', trial: 'DESTINY-Breast12' },
                    { title: 'Tucatinib+Trastuzumab+Capecitabine', desc: 'CNS転移に有効', trial: 'HER2CLIMB' }
                ],
                trials: ['DESTINY-Breast12', 'HER2CLIMB'],
                notes: 'CNS転移に対してはTucatinib併用療法やT-DXdが有効性を示しています。'
            }
        }
    },

    // =========================================
    // HR+ Early Breast Cancer
    // =========================================
    'hr-early': {
        name: 'HR陽性早期乳がん',
        color: '#10b981',
        firstQuestion: 'node_status',
        questions: {
            node_status: {
                title: 'リンパ節転移の状態',
                description: '術後病理結果に基づいて選択してください',
                options: [
                    { id: 'node_neg', label: 'リンパ節転移陰性 (N0)', sub: 'TailorX適応', next: 'node_neg_menopause' },
                    { id: '1_3_ln', label: '1-3個のリンパ節転移 (N1)', sub: 'RxPONDER適応', next: 'node_1_3_menopause' },
                    { id: '4_plus_ln', label: '4個以上のリンパ節転移 (N2+)', sub: '化学療法推奨', next: 'result_4plus_ln' }
                ]
            },
            node_neg_menopause: {
                title: '閉経状態',
                description: '',
                options: [
                    { id: 'pre', label: '閉経前', sub: '', next: 'node_neg_pre_rs' },
                    { id: 'post', label: '閉経後', sub: '', next: 'node_neg_post_rs' }
                ]
            },
            node_neg_pre_rs: {
                title: 'Oncotype DX Recurrence Score (RS)',
                description: '21遺伝子検査の結果',
                options: [
                    { id: 'rs_1_15', label: 'RS 1-15', sub: '低リスク', next: 'result_n0_pre_low' },
                    { id: 'rs_16_25', label: 'RS 16-25', sub: '中間リスク', next: 'result_n0_pre_mid' },
                    { id: 'rs_26_plus', label: 'RS 26以上', sub: '高リスク', next: 'result_n0_pre_high' }
                ]
            },
            node_neg_post_rs: {
                title: 'Oncotype DX Recurrence Score (RS)',
                description: '21遺伝子検査の結果',
                options: [
                    { id: 'rs_1_25', label: 'RS 1-25', sub: '内分泌療法のみ', next: 'result_n0_post_low' },
                    { id: 'rs_26_plus', label: 'RS 26以上', sub: '化学療法の上乗せ効果あり', next: 'result_n0_post_high' }
                ]
            },
            node_1_3_menopause: {
                title: '閉経状態',
                description: '',
                options: [
                    { id: 'pre', label: '閉経前', sub: '', next: 'node_1_3_pre_rs' },
                    { id: 'post', label: '閉経後', sub: '', next: 'node_1_3_post_rs' }
                ]
            },
            node_1_3_pre_rs: {
                title: 'Oncotype DX Recurrence Score (RS)',
                description: 'RxPONDER試験に基づく',
                options: [
                    { id: 'rs_1_25', label: 'RS 1-25', sub: '化学療法 vs OFS+AIを検討', next: 'result_n1_pre_low' },
                    { id: 'rs_26_plus', label: 'RS 26以上', sub: '化学療法推奨', next: 'result_n1_pre_high' }
                ]
            },
            node_1_3_post_rs: {
                title: 'Oncotype DX Recurrence Score (RS)',
                description: '',
                options: [
                    { id: 'rs_1_25', label: 'RS 1-25', sub: '内分泌療法のみ', next: 'result_n1_post_low' },
                    { id: 'rs_26_plus', label: 'RS 26以上', sub: '化学療法追加', next: 'result_n1_post_high' }
                ]
            }
        },
        results: {
            result_n0_pre_low: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '内分泌療法', desc: 'タモキシフェン5-10年' }
                ],
                trials: ['TailorX'],
                notes: 'RS 1-15の閉経前N0患者は内分泌療法のみで良好な予後が期待できます。'
            },
            result_n0_pre_mid: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '内分泌療法', desc: 'タモキシフェン（一部に化学療法の上乗せ効果の可能性）' }
                ],
                trials: ['TailorX'],
                notes: 'RS 16-25の閉経前では一部の患者で化学療法の上乗せ効果がある可能性があります。臨床リスクと併せて判断してください。'
            },
            result_n0_pre_high: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後化学療法', desc: 'TC または ddAC-T' },
                    { title: '内分泌療法', desc: 'タモキシフェン' }
                ],
                trials: ['TailorX'],
                notes: 'RS 26以上では化学療法の上乗せ効果が明確です。'
            },
            result_n0_post_low: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '内分泌療法', desc: 'アロマターゼ阻害剤5-10年' }
                ],
                trials: ['TailorX'],
                notes: 'RS 1-25の閉経後N0患者は内分泌療法のみで十分なOS効果が得られます。'
            },
            result_n0_post_high: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後化学療法', desc: 'TC または ddAC-T' },
                    { title: '内分泌療法', desc: 'アロマターゼ阻害剤' }
                ],
                trials: ['TailorX'],
                notes: 'RS 26以上では化学療法追加でOS改善が期待できます。'
            },
            result_n1_pre_low: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '化学療法 vs OFS+AI', desc: '化学療法またはOFS+アロマターゼ阻害剤を検討' },
                    { title: '内分泌療法', desc: 'タモキシフェンまたはOFS+AI' }
                ],
                trials: ['RxPONDER'],
                notes: 'RS 1-25の閉経前N1患者では化学療法の上乗せ効果がある可能性（RxPONDER）。OFS+AIとの比較も検討されています。'
            },
            result_n1_pre_high: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後化学療法', desc: 'TC または ddAC-T' },
                    { title: '内分泌療法', desc: 'タモキシフェンまたはOFS+AI' }
                ],
                trials: ['RxPONDER'],
                notes: 'RS 26以上のN1患者は化学療法が推奨されます。'
            },
            result_n1_post_low: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '内分泌療法', desc: 'アロマターゼ阻害剤' }
                ],
                trials: ['RxPONDER'],
                notes: 'RS 1-25の閉経後N1患者は内分泌療法のみで良好な予後が期待できます。'
            },
            result_n1_post_high: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後化学療法', desc: 'TC または ddAC-T' },
                    { title: '内分泌療法', desc: 'アロマターゼ阻害剤' }
                ],
                trials: ['RxPONDER'],
                notes: 'RS 26以上では化学療法追加を推奨します。'
            },
            result_4plus_ln: {
                pathway: [
                    { title: '手術', desc: '乳房温存術または乳房切除術' },
                    { title: '術後化学療法', desc: 'ddAC-T（dose-dense）推奨' },
                    { title: '内分泌療法', desc: 'タモキシフェンまたはアロマターゼ阻害剤' }
                ],
                trials: [],
                notes: '4個以上のリンパ節転移はRxPONDER/TailorXの適応外です。化学療法を推奨します。CDK4/6阻害剤の追加（MonarchE、NATALEE）やgBRCA変異陽性の場合オラパリブ（OlympiA）も検討してください。',
                additionalOptions: [
                    'MonarchE: アベマシクリブ2年 (4+ LN または 1-3 LN + G3 または 5cm以上)',
                    'NATALEE: リボシクリブ3年 (Stage 2A以上)',
                    'OlympiA: オラパリブ1年 (gBRCA変異陽性、T2以上 または 4+ LN)'
                ]
            }
        }
    },

    // =========================================
    // HR+ Advanced Breast Cancer
    // =========================================
    'hr-advanced': {
        name: 'HR陽性進行乳がん',
        color: '#f59e0b',
        firstQuestion: 'endocrine_sensitivity',
        questions: {
            endocrine_sensitivity: {
                title: '内分泌療法への感受性',
                description: '過去の治療歴に基づいて判断してください',
                options: [
                    { id: 'sensitive', label: '内分泌感受性', sub: 'De novo Stage IV、または術後ET後12ヶ月以上で再発', next: 'sensitive_mutation' },
                    { id: 'resistant', label: '内分泌抵抗性', sub: '術後ET中または終了12ヶ月以内に再発', next: 'resistant_pik3ca' }
                ]
            },
            sensitive_mutation: {
                title: '遺伝子変異の状態（NGS/Germline検査）',
                description: '治療選択に影響する変異を確認してください',
                options: [
                    { id: 'pik3ca_pten_akt', label: 'PIK3CA/PTEN/AKT変異', sub: 'PI3K/AKT経路', next: 'result_sens_pik3ca' },
                    { id: 'esr1', label: 'ESR1変異', sub: 'エストロゲン受容体変異', next: 'result_sens_esr1' },
                    { id: 'brca', label: 'gBRCA変異', sub: 'BRCA1/2変異', next: 'result_sens_brca' },
                    { id: 'none', label: '上記変異なし / 検査未実施', sub: 'CDK4/6阻害剤+内分泌療法', next: 'result_sens_standard' }
                ]
            },
            resistant_pik3ca: {
                title: 'PIK3CA変異の状態',
                description: '',
                options: [
                    { id: 'wt', label: 'PIK3CA野生型', sub: '', next: 'resistant_wt_option' },
                    { id: 'mut', label: 'PIK3CA変異陽性', sub: 'Inavolisib適応', next: 'result_resistant_pik3ca_mut' }
                ]
            },
            resistant_wt_option: {
                title: '次の治療選択',
                description: '2L以降の治療オプション',
                options: [
                    { id: 'her2_status', label: 'HER2発現を確認', sub: 'HER2-low/ultralow判定へ', next: 'resistant_her2' },
                    { id: 'other', label: 'その他の選択肢', sub: 'Everolimus、Fulvestrantなど', next: 'result_resistant_other' }
                ]
            },
            resistant_her2: {
                title: 'HER2発現レベル',
                description: 'IHC/ISH結果を確認してください',
                options: [
                    { id: 'her2_low', label: 'HER2-low (IHC 1-2+)', sub: 'ADC適応', next: 'result_resistant_her2_low' },
                    { id: 'her2_ultralow', label: 'HER2-ultralow', sub: 'T-DXd検討', next: 'result_resistant_her2_ultralow' },
                    { id: 'her2_0', label: 'HER2 0 / Null', sub: '', next: 'result_resistant_her2_0' }
                ]
            }
        },
        results: {
            result_sens_standard: {
                pathway: [
                    { title: 'CDK4/6阻害剤 + 内分泌療法', desc: 'リボシクリブ、アベマシクリブ、またはパルボシクリブ + AI', trial: 'MONALEESA-2,3,7 / Monarch 2,3 / PALOMA-2,3' }
                ],
                trials: ['MONALEESA-2,3,7', 'Monarch 2,3', 'PALOMA-2,3'],
                notes: 'リボシクリブはOS改善を示した唯一のCDK4/6阻害剤です。NGSとGermline検査を推奨します。',
                additionalOptions: [
                    '*evERA: giradestrant vs ET+everolimus (PFS 9.9 vs 5.4)',
                    '*VIKTORIA: gedatolisib + fulvestrant ± palbo (PFS 12.9 vs 5.6)',
                    '*SERENA-6: AI → camizestrant (ESR1変異出現時の切り替え)'
                ]
            },
            result_sens_pik3ca: {
                pathway: [
                    { title: 'Capivasertib + 内分泌療法', desc: 'AKT阻害剤', trial: 'CAPItello-291' },
                    { title: 'または Alpelisib + 内分泌療法', desc: 'PI3K阻害剤（PIK3CA変異限定）', trial: 'SOLAR-1, ByLive' }
                ],
                trials: ['CAPItello-291', 'SOLAR-1', 'ByLive'],
                notes: 'PIK3CA/PTEN/AKT変異陽性患者にはAKT/PI3K阻害剤が有効です。'
            },
            result_sens_esr1: {
                pathway: [
                    { title: 'Elacestrant', desc: '経口SERD', trial: 'EMERALD' },
                    { title: 'または Imlunestrant', desc: '次世代SERD', trial: 'EMBER-3' }
                ],
                trials: ['EMERALD', 'EMBER-3'],
                notes: 'ESR1変異陽性患者には経口SERDが有効です。'
            },
            result_sens_brca: {
                pathway: [
                    { title: 'PARP阻害剤', desc: 'オラパリブまたはタラゾパリブ', trial: 'OlympiAD, EMBRACA' }
                ],
                trials: ['OlympiAD', 'EMBRACA'],
                notes: 'gBRCA変異陽性患者にはPARP阻害剤が有効です。'
            },
            result_resistant_pik3ca_mut: {
                pathway: [
                    { title: 'Inavolisib + Palbo + Fulvestrant', desc: 'PI3Kα阻害剤併用', trial: 'INAVO120' }
                ],
                trials: ['INAVO120'],
                notes: '内分泌抵抗性かつPIK3CA変異陽性患者に対する新規治療オプションです。'
            },
            result_resistant_other: {
                pathway: [
                    { title: 'Everolimus + AI または Fulvestrant', desc: 'mTOR阻害剤', trial: 'BOLERO-2' },
                    { title: 'または 化学療法', desc: '標準化学療法' }
                ],
                trials: ['BOLERO-2'],
                notes: '複数の選択肢があります。HER2発現の再評価も検討してください。'
            },
            result_resistant_her2_low: {
                pathway: [
                    { title: '化学療法', desc: '標準化学療法' },
                    { title: 'T-DXd', desc: 'HER2-lowに対するADC', trial: 'DESTINY-Breast04' },
                    { title: 'サシツズマブ ゴビテカン', desc: 'Trop-2 ADC', trial: 'TROPiCS-02' }
                ],
                trials: ['DESTINY-Breast04', 'TROPiCS-02', 'TROPION-Breast01'],
                notes: 'HER2-lowの場合、T-DXdが有効です。化学療法後にADCを検討してください。'
            },
            result_resistant_her2_ultralow: {
                pathway: [
                    { title: 'T-DXd', desc: 'HER2-ultralowにも有効性を示唆', trial: 'DESTINY-Breast06' },
                    { title: 'または 化学療法 → ADC', desc: '' }
                ],
                trials: ['DESTINY-Breast06'],
                notes: 'HER2-ultralowに対してもT-DXdの有効性が検討されています（DB06）。'
            },
            result_resistant_her2_0: {
                pathway: [
                    { title: '化学療法', desc: '標準化学療法' },
                    { title: 'Dato-DXd', desc: 'Trop-2 ADC', trial: 'TROPION-Breast01' },
                    { title: 'サシツズマブ ゴビテカン', desc: 'Trop-2 ADC', trial: 'TROPiCS-02' }
                ],
                trials: ['TROPION-Breast01', 'TROPiCS-02'],
                notes: 'HER2 0/Nullの場合はTrop-2標的ADCを検討してください。'
            }
        }
    }
};

// =========================================
// Application State
// =========================================
let state = {
    currentSubtype: null,
    currentQuestion: null,
    answers: [],
    step: 1
};

// =========================================
// DOM Elements
// =========================================
const elements = {
    startScreen: document.getElementById('start-screen'),
    decisionScreen: document.getElementById('decision-screen'),
    resultScreen: document.getElementById('result-screen'),
    subtypeCards: document.querySelectorAll('.subtype-card'),
    backBtn: document.getElementById('back-btn'),
    resultBackBtn: document.getElementById('result-back-btn'),
    restartBtn: document.getElementById('restart-btn'),
    breadcrumb: document.getElementById('breadcrumb'),
    stepIndicator: document.getElementById('step-indicator'),
    questionTitle: document.getElementById('question-title'),
    questionDesc: document.getElementById('question-desc'),
    optionsContainer: document.getElementById('options-container'),
    treatmentPathway: document.getElementById('treatment-pathway'),
    clinicalTrials: document.getElementById('clinical-trials'),
    additionalNotes: document.getElementById('additional-notes'),
    summaryList: document.getElementById('summary-list')
};

// =========================================
// Screen Management
// =========================================
function showScreen(screenName) {
    [elements.startScreen, elements.decisionScreen, elements.resultScreen].forEach(screen => {
        screen.classList.remove('active');
    });
    
    switch(screenName) {
        case 'start':
            elements.startScreen.classList.add('active');
            break;
        case 'decision':
            elements.decisionScreen.classList.add('active');
            break;
        case 'result':
            elements.resultScreen.classList.add('active');
            break;
    }
}

// =========================================
// Initialize Subtype Selection
// =========================================
function initSubtypeSelection() {
    elements.subtypeCards.forEach(card => {
        card.addEventListener('click', () => {
            const subtype = card.dataset.subtype;
            startDecisionTree(subtype);
        });
    });
}

// =========================================
// Start Decision Tree
// =========================================
function startDecisionTree(subtype) {
    state.currentSubtype = subtype;
    state.answers = [];
    state.step = 1;
    
    const tree = decisionTrees[subtype];
    state.currentQuestion = tree.firstQuestion;
    
    showScreen('decision');
    renderQuestion();
}

// =========================================
// Render Question
// =========================================
function renderQuestion() {
    const tree = decisionTrees[state.currentSubtype];
    const question = tree.questions[state.currentQuestion];
    
    // Update step indicator
    elements.stepIndicator.textContent = `Step ${state.step}`;
    
    // Update question content
    elements.questionTitle.textContent = question.title;
    elements.questionDesc.textContent = question.description || '';
    
    // Update breadcrumb
    updateBreadcrumb();
    
    // Render options
    elements.optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerHTML = `
            <div class="option-main">${option.label}</div>
            ${option.sub ? `<div class="option-sub">${option.sub}</div>` : ''}
            ${option.trial ? `<span class="option-trial">${option.trial}</span>` : ''}
        `;
        button.addEventListener('click', () => selectOption(option));
        elements.optionsContainer.appendChild(button);
    });
}

// =========================================
// Update Breadcrumb
// =========================================
function updateBreadcrumb() {
    const tree = decisionTrees[state.currentSubtype];
    let html = `<span class="breadcrumb-item">${tree.name}</span>`;
    
    state.answers.forEach((answer, index) => {
        html += `<span class="breadcrumb-item">${answer.label}</span>`;
    });
    
    elements.breadcrumb.innerHTML = html;
}

// =========================================
// Select Option
// =========================================
function selectOption(option) {
    // Store answer
    state.answers.push({
        questionId: state.currentQuestion,
        answerId: option.id,
        label: option.label
    });
    
    // Check if this leads to a result
    if (option.next.startsWith('result_')) {
        showResult(option.next);
    } else {
        // Move to next question
        state.currentQuestion = option.next;
        state.step++;
        renderQuestion();
    }
}

// =========================================
// Show Result
// =========================================
function showResult(resultId) {
    const tree = decisionTrees[state.currentSubtype];
    const result = tree.results[resultId];
    
    // Render treatment pathway
    let pathwayHtml = '';
    result.pathway.forEach((step, index) => {
        pathwayHtml += `
            <div class="pathway-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <div class="step-title">${step.title}</div>
                    <div class="step-desc">${step.desc}</div>
                    ${step.trial ? `<span class="step-trial">${step.trial}</span>` : ''}
                </div>
            </div>
        `;
    });
    elements.treatmentPathway.innerHTML = pathwayHtml;
    
    // Render clinical trials
    if (result.trials && result.trials.length > 0) {
        let trialsHtml = '<h3>関連臨床試験</h3><div class="trial-list">';
        result.trials.forEach(trial => {
            trialsHtml += `<div class="trial-item">${trial}</div>`;
        });
        trialsHtml += '</div>';
        elements.clinicalTrials.innerHTML = trialsHtml;
        elements.clinicalTrials.style.display = 'block';
    } else {
        elements.clinicalTrials.style.display = 'none';
    }
    
    // Render additional notes
    if (result.notes || result.additionalOptions) {
        let notesHtml = '<h3>補足情報</h3>';
        if (result.notes) {
            notesHtml += `<p>${result.notes}</p>`;
        }
        if (result.additionalOptions) {
            notesHtml += '<p style="margin-top: 12px;"><strong>追加の選択肢:</strong></p><ul style="margin-top: 8px; padding-left: 20px;">';
            result.additionalOptions.forEach(opt => {
                notesHtml += `<li style="margin-bottom: 4px; font-size: 0.9rem;">${opt}</li>`;
            });
            notesHtml += '</ul>';
        }
        elements.additionalNotes.innerHTML = notesHtml;
        elements.additionalNotes.style.display = 'block';
    } else {
        elements.additionalNotes.style.display = 'none';
    }
    
    // Render decision summary
    let summaryHtml = '';
    summaryHtml += `<span class="summary-item">${tree.name}</span>`;
    state.answers.forEach(answer => {
        summaryHtml += `<span class="summary-item">${answer.label}</span>`;
    });
    elements.summaryList.innerHTML = summaryHtml;
    
    showScreen('result');
}

// =========================================
// Navigation
// =========================================
function goBack() {
    if (state.answers.length === 0) {
        // Go back to start screen
        showScreen('start');
        state.currentSubtype = null;
        state.currentQuestion = null;
    } else {
        // Go back to previous question
        const previousAnswer = state.answers.pop();
        state.currentQuestion = previousAnswer.questionId;
        state.step--;
        
        // Ensure we are on the decision screen (important when coming from result screen)
        showScreen('decision');
        renderQuestion();
    }
}

function restart() {
    state.currentSubtype = null;
    state.currentQuestion = null;
    state.answers = [];
    state.step = 1;
    showScreen('start');
}

// =========================================
// Event Listeners
// =========================================
function initEventListeners() {
    elements.backBtn.addEventListener('click', goBack);
    elements.resultBackBtn.addEventListener('click', goBack); // Changed from restart to goBack
    elements.restartBtn.addEventListener('click', restart);
}

// =========================================
// Initialize Application
// =========================================
function init() {
    initSubtypeSelection();
    initEventListeners();
}

// Start the application
document.addEventListener('DOMContentLoaded', init);
