window.PLANT_TREE_DATA = {
  version: "2026-05-15-search-taxon-lookup",
  rootId: "land-plants",
  sources: {
    apg_iv: {
      label: "APG IV",
      citation: "Angiosperm Phylogeny Group. 2016. Botanical Journal of the Linnean Society 181: 1-20.",
      url: "https://academic.oup.com/botlinnean/article/181/1/1/2416499",
      scope: "APG IV flowering plant clades, 64 orders, and 416 families."
    },
    ppg_i: {
      label: "PPG I",
      citation: "Pteridophyte Phylogeny Group. 2016. Journal of Systematics and Evolution 54: 563-603.",
      url: "https://www.uvm.edu/~dbarring/209/ppgI2016.pdf",
      scope: "PPG I lycophyte and fern clades, 14 orders, and 51 families."
    },
    gymnosperms_2011: {
      label: "Christenhusz et al. 2011",
      citation: "Christenhusz, Reveal, Farjon, Gardner, Mill & Chase. 2011. Phytotaxa 19: 55-70.",
      url: "https://phytotaxa.mapress.com/pt/article/view/phytotaxa.19.1.3",
      scope: "Extant gymnosperm clades, 8 orders, and 12 families."
    },
    bryophyta_nomenclator: {
      label: "Bryophyte Nomenclator",
      citation: "Bryophyte Nomenclator classification, accessed for moss classification anchors.",
      url: "https://www.bryonames.org/nomenclator?group=Bryophyta",
      scope: "Current moss scaffold; liverwort and hornwort branches need stronger source coverage."
    },
    broad_consensus: {
      label: "Broad botanical consensus",
      citation: "Encyclopaedia Britannica. Plant.",
      url: "https://www.britannica.com/plant/plant",
      scope: "Broad educational grouping labels only."
    },
    brit_asteraceae: {
      label: "Britannica Asteraceae",
      citation: "Encyclopaedia Britannica. Asteraceae: Physical characteristics.",
      url: "https://www.britannica.com/plant/Asteraceae/Physical-characteristics",
      scope: "Asteraceae fact-pane enrichment."
    },
    brit_orchid: {
      label: "Britannica orchid morphology",
      citation: "Encyclopaedia Britannica. Orchid: characteristic morphological features.",
      url: "https://www.britannica.com/plant/orchid/Characteristic-morphological-features",
      scope: "Orchidaceae fact-pane enrichment."
    }
  },
  nodes: [
    {
      id: "land-plants",
      name: "Land plants",
      rank: "clade",
      source: "broad_consensus",
      description: "Embryophytes: the major lineage of plants adapted to life on land.",
      children: ["bryophyte-grade", "vascular-plants"]
    },
    {
      id: "bryophyte-grade",
      name: "Bryophytes",
      rank: "grade",
      source: "broad_consensus",
      description: "Non-vascular land plant lineages, represented here by mosses, liverworts, and hornworts.",
      children: ["mosses", "liverworts", "hornworts"]
    },
    {
      id: "mosses",
      name: "Mosses",
      rank: "clade",
      source: "bryophyta_nomenclator",
      children: ["bryales", "sphagnales"]
    },
    {
      id: "bryales",
      name: "Bryales",
      rank: "order",
      source: "bryophyta_nomenclator",
      children: ["bryaceae"]
    },
    {
      id: "bryaceae",
      name: "Bryaceae",
      rank: "family",
      source: "bryophyta_nomenclator",
      children: ["bryum", "pohlia"]
    },
    {
      id: "bryum",
      name: "Bryum",
      rank: "genus",
      source: "bryophyta_nomenclator"
    },
    {
      id: "pohlia",
      name: "Pohlia",
      rank: "genus",
      source: "bryophyta_nomenclator"
    },
    {
      id: "sphagnales",
      name: "Sphagnales",
      rank: "order",
      source: "bryophyta_nomenclator",
      children: ["sphagnaceae"]
    },
    {
      id: "sphagnaceae",
      name: "Sphagnaceae",
      rank: "family",
      source: "bryophyta_nomenclator",
      children: ["sphagnum"]
    },
    {
      id: "sphagnum",
      name: "Sphagnum",
      rank: "genus",
      source: "bryophyta_nomenclator"
    },
    {
      id: "liverworts",
      name: "Liverworts",
      rank: "clade",
      source: "broad_consensus",
      children: ["marchantiales"]
    },
    {
      id: "marchantiales",
      name: "Marchantiales",
      rank: "order",
      source: "broad_consensus",
      children: ["marchantiaceae"]
    },
    {
      id: "marchantiaceae",
      name: "Marchantiaceae",
      rank: "family",
      source: "broad_consensus",
      children: ["marchantia"]
    },
    {
      id: "marchantia",
      name: "Marchantia",
      rank: "genus",
      source: "broad_consensus"
    },
    {
      id: "hornworts",
      name: "Hornworts",
      rank: "clade",
      source: "broad_consensus",
      children: ["anthocerotales"]
    },
    {
      id: "anthocerotales",
      name: "Anthocerotales",
      rank: "order",
      source: "broad_consensus",
      children: ["anthocerotaceae"]
    },
    {
      id: "anthocerotaceae",
      name: "Anthocerotaceae",
      rank: "family",
      source: "broad_consensus",
      children: ["anthoceros"]
    },
    {
      id: "anthoceros",
      name: "Anthoceros",
      rank: "genus",
      source: "broad_consensus"
    },
    {
      id: "vascular-plants",
      name: "Vascular plants",
      rank: "clade",
      source: "broad_consensus",
      description: "Tracheophytes: plants with vascular tissue.",
      children: ["lycophytes", "ferns", "seed-plants"]
    },
    {
      id: "lycophytes",
      name: "Lycophytes",
      rank: "clade",
      source: "ppg_i",
      children: ["lycopodiales", "isoetales", "selaginellales"]
    },
    {
      id: "lycopodiales",
      name: "Lycopodiales",
      rank: "order",
      source: "ppg_i",
      children: ["lycopodiaceae"]
    },
    {
      id: "lycopodiaceae",
      name: "Lycopodiaceae",
      rank: "family",
      source: "ppg_i",
      children: ["lycopodium", "huperzia"]
    },
    {
      id: "lycopodium",
      name: "Lycopodium",
      rank: "genus",
      source: "ppg_i"
    },
    {
      id: "huperzia",
      name: "Huperzia",
      rank: "genus",
      source: "ppg_i"
    },
    {
      id: "isoetales",
      name: "Isoetales",
      rank: "order",
      source: "ppg_i",
      children: ["isoetaceae"]
    },
    {
      id: "isoetaceae",
      name: "Isoetaceae",
      rank: "family",
      source: "ppg_i",
      children: ["isoetes"]
    },
    {
      id: "isoetes",
      name: "Isoetes",
      rank: "genus",
      source: "ppg_i"
    },
    {
      id: "selaginellales",
      name: "Selaginellales",
      rank: "order",
      source: "ppg_i",
      children: ["selaginellaceae"]
    },
    {
      id: "selaginellaceae",
      name: "Selaginellaceae",
      rank: "family",
      source: "ppg_i",
      children: ["selaginella"]
    },
    {
      id: "selaginella",
      name: "Selaginella",
      rank: "genus",
      source: "ppg_i"
    },
    {
      id: "ferns",
      name: "Ferns",
      rank: "clade",
      source: "ppg_i",
      children: ["equisetales", "psilotales", "ophioglossales", "marattiales", "osmundales", "hymenophyllales", "gleicheniales", "schizaeales", "salviniales", "cyatheales", "polypodiales"]
    },
    {
      id: "equisetales",
      name: "Equisetales",
      rank: "order",
      source: "ppg_i",
      children: ["equisetaceae"]
    },
    {
      id: "equisetaceae",
      name: "Equisetaceae",
      rank: "family",
      source: "ppg_i",
      children: ["equisetum"]
    },
    {
      id: "equisetum",
      name: "Equisetum",
      rank: "genus",
      source: "ppg_i"
    },
    { id: "psilotales", name: "Psilotales", rank: "order", source: "ppg_i", children: ["psilotaceae"] },
    { id: "psilotaceae", name: "Psilotaceae", rank: "family", source: "ppg_i", children: ["psilotum", "tmesipteris"] },
    { id: "psilotum", name: "Psilotum", rank: "genus", source: "ppg_i" },
    { id: "tmesipteris", name: "Tmesipteris", rank: "genus", source: "ppg_i" },
    { id: "ophioglossales", name: "Ophioglossales", rank: "order", source: "ppg_i", children: ["ophioglossaceae"] },
    { id: "ophioglossaceae", name: "Ophioglossaceae", rank: "family", source: "ppg_i", children: ["ophioglossum", "botrychium"] },
    { id: "ophioglossum", name: "Ophioglossum", rank: "genus", source: "ppg_i" },
    { id: "botrychium", name: "Botrychium", rank: "genus", source: "ppg_i" },
    { id: "marattiales", name: "Marattiales", rank: "order", source: "ppg_i", children: ["marattiaceae"] },
    { id: "marattiaceae", name: "Marattiaceae", rank: "family", source: "ppg_i", children: ["marattia", "angiopteris"] },
    { id: "marattia", name: "Marattia", rank: "genus", source: "ppg_i" },
    { id: "angiopteris", name: "Angiopteris", rank: "genus", source: "ppg_i" },
    { id: "osmundales", name: "Osmundales", rank: "order", source: "ppg_i", children: ["osmundaceae"] },
    { id: "osmundaceae", name: "Osmundaceae", rank: "family", source: "ppg_i", children: ["osmunda", "osmundastrum"] },
    { id: "osmunda", name: "Osmunda", rank: "genus", source: "ppg_i" },
    { id: "osmundastrum", name: "Osmundastrum", rank: "genus", source: "ppg_i" },
    { id: "hymenophyllales", name: "Hymenophyllales", rank: "order", source: "ppg_i", children: ["hymenophyllaceae"] },
    { id: "hymenophyllaceae", name: "Hymenophyllaceae", rank: "family", source: "ppg_i", children: ["hymenophyllum", "trichomanes"] },
    { id: "hymenophyllum", name: "Hymenophyllum", rank: "genus", source: "ppg_i" },
    { id: "trichomanes", name: "Trichomanes", rank: "genus", source: "ppg_i" },
    { id: "gleicheniales", name: "Gleicheniales", rank: "order", source: "ppg_i", children: ["matoniaceae", "dipteridaceae", "gleicheniaceae"] },
    { id: "matoniaceae", name: "Matoniaceae", rank: "family", source: "ppg_i", children: ["matonia", "phanerosorus"] },
    { id: "matonia", name: "Matonia", rank: "genus", source: "ppg_i" },
    { id: "phanerosorus", name: "Phanerosorus", rank: "genus", source: "ppg_i" },
    { id: "dipteridaceae", name: "Dipteridaceae", rank: "family", source: "ppg_i", children: ["dipteris", "cheiropleuria"] },
    { id: "dipteris", name: "Dipteris", rank: "genus", source: "ppg_i" },
    { id: "cheiropleuria", name: "Cheiropleuria", rank: "genus", source: "ppg_i" },
    { id: "gleicheniaceae", name: "Gleicheniaceae", rank: "family", source: "ppg_i", children: ["gleichenia", "dicranopteris"] },
    { id: "gleichenia", name: "Gleichenia", rank: "genus", source: "ppg_i" },
    { id: "dicranopteris", name: "Dicranopteris", rank: "genus", source: "ppg_i" },
    { id: "schizaeales", name: "Schizaeales", rank: "order", source: "ppg_i", children: ["lygodiaceae", "schizaeaceae", "anemiaceae"] },
    { id: "lygodiaceae", name: "Lygodiaceae", rank: "family", source: "ppg_i", children: ["lygodium"] },
    { id: "lygodium", name: "Lygodium", rank: "genus", source: "ppg_i" },
    { id: "schizaeaceae", name: "Schizaeaceae", rank: "family", source: "ppg_i", children: ["schizaea", "actinostachys"] },
    { id: "schizaea", name: "Schizaea", rank: "genus", source: "ppg_i" },
    { id: "actinostachys", name: "Actinostachys", rank: "genus", source: "ppg_i" },
    { id: "anemiaceae", name: "Anemiaceae", rank: "family", source: "ppg_i", children: ["anemia"] },
    { id: "anemia", name: "Anemia", rank: "genus", source: "ppg_i" },
    { id: "salviniales", name: "Salviniales", rank: "order", source: "ppg_i", children: ["salviniaceae", "marsileaceae"] },
    { id: "salviniaceae", name: "Salviniaceae", rank: "family", source: "ppg_i", children: ["salvinia", "azolla"] },
    { id: "salvinia", name: "Salvinia", rank: "genus", source: "ppg_i" },
    { id: "azolla", name: "Azolla", rank: "genus", source: "ppg_i" },
    { id: "marsileaceae", name: "Marsileaceae", rank: "family", source: "ppg_i", children: ["marsilea", "pilularia"] },
    { id: "marsilea", name: "Marsilea", rank: "genus", source: "ppg_i" },
    { id: "pilularia", name: "Pilularia", rank: "genus", source: "ppg_i" },
    { id: "cyatheales", name: "Cyatheales", rank: "order", source: "ppg_i", children: ["thyrsopteridaceae", "loxsomataceae", "culcitaceae", "plagiogyriaceae", "cibotiaceae", "metaxyaceae", "dicksoniaceae", "cyatheaceae"] },
    { id: "thyrsopteridaceae", name: "Thyrsopteridaceae", rank: "family", source: "ppg_i", children: ["thyrsopteris"] },
    { id: "thyrsopteris", name: "Thyrsopteris", rank: "genus", source: "ppg_i" },
    { id: "loxsomataceae", name: "Loxsomataceae", rank: "family", source: "ppg_i", children: ["loxsoma", "loxsomopsis"] },
    { id: "loxsoma", name: "Loxsoma", rank: "genus", source: "ppg_i" },
    { id: "loxsomopsis", name: "Loxsomopsis", rank: "genus", source: "ppg_i" },
    { id: "culcitaceae", name: "Culcitaceae", rank: "family", source: "ppg_i", children: ["culcita"] },
    { id: "culcita", name: "Culcita", rank: "genus", source: "ppg_i" },
    { id: "plagiogyriaceae", name: "Plagiogyriaceae", rank: "family", source: "ppg_i", children: ["plagiogyria"] },
    { id: "plagiogyria", name: "Plagiogyria", rank: "genus", source: "ppg_i" },
    { id: "cibotiaceae", name: "Cibotiaceae", rank: "family", source: "ppg_i", children: ["cibotium"] },
    { id: "cibotium", name: "Cibotium", rank: "genus", source: "ppg_i" },
    { id: "metaxyaceae", name: "Metaxyaceae", rank: "family", source: "ppg_i", children: ["metaxya"] },
    { id: "metaxya", name: "Metaxya", rank: "genus", source: "ppg_i" },
    { id: "dicksoniaceae", name: "Dicksoniaceae", rank: "family", source: "ppg_i", children: ["dicksonia", "calochlaena"] },
    { id: "dicksonia", name: "Dicksonia", rank: "genus", source: "ppg_i" },
    { id: "calochlaena", name: "Calochlaena", rank: "genus", source: "ppg_i" },
    { id: "cyatheaceae", name: "Cyatheaceae", rank: "family", source: "ppg_i", children: ["cyathea", "alsophila"] },
    { id: "cyathea", name: "Cyathea", rank: "genus", source: "ppg_i" },
    { id: "alsophila", name: "Alsophila", rank: "genus", source: "ppg_i" },
    {
      id: "polypodiales",
      name: "Polypodiales",
      rank: "order",
      source: "ppg_i",
      children: ["saccolomataceae", "cystodiaceae", "lonchitidaceae", "lindsaeaceae", "pteridaceae", "dennstaedtiaceae", "cystopteridaceae", "rhachidosoraceae", "diplaziopsidaceae", "desmophlebiaceae", "hemidictyaceae", "aspleniaceae", "woodsiaceae", "onocleaceae", "blechnaceae", "athyriaceae", "thelypteridaceae", "didymochlaenaceae", "hypodematiaceae", "dryopteridaceae", "nephrolepidaceae", "lomariopsidaceae", "tectariaceae", "oleandraceae", "davalliaceae", "polypodiaceae"]
    },
    { id: "saccolomataceae", name: "Saccolomataceae", rank: "family", source: "ppg_i", children: ["saccoloma"] },
    { id: "saccoloma", name: "Saccoloma", rank: "genus", source: "ppg_i" },
    { id: "cystodiaceae", name: "Cystodiaceae", rank: "family", source: "ppg_i", children: ["cystodium"] },
    { id: "cystodium", name: "Cystodium", rank: "genus", source: "ppg_i" },
    { id: "lonchitidaceae", name: "Lonchitidaceae", rank: "family", source: "ppg_i", children: ["lonchitis"] },
    { id: "lonchitis", name: "Lonchitis", rank: "genus", source: "ppg_i" },
    { id: "lindsaeaceae", name: "Lindsaeaceae", rank: "family", source: "ppg_i", children: ["lindsaea"] },
    { id: "lindsaea", name: "Lindsaea", rank: "genus", source: "ppg_i" },
    { id: "pteridaceae", name: "Pteridaceae", rank: "family", source: "ppg_i", children: ["pteris", "adiantum"] },
    { id: "pteris", name: "Pteris", rank: "genus", source: "ppg_i" },
    { id: "adiantum", name: "Adiantum", rank: "genus", source: "ppg_i" },
    { id: "dennstaedtiaceae", name: "Dennstaedtiaceae", rank: "family", source: "ppg_i", children: ["dennstaedtia", "pteridium"] },
    { id: "dennstaedtia", name: "Dennstaedtia", rank: "genus", source: "ppg_i" },
    { id: "pteridium", name: "Pteridium", rank: "genus", source: "ppg_i" },
    { id: "cystopteridaceae", name: "Cystopteridaceae", rank: "family", source: "ppg_i", children: ["cystopteris", "gymnocarpium"] },
    { id: "cystopteris", name: "Cystopteris", rank: "genus", source: "ppg_i" },
    { id: "gymnocarpium", name: "Gymnocarpium", rank: "genus", source: "ppg_i" },
    { id: "rhachidosoraceae", name: "Rhachidosoraceae", rank: "family", source: "ppg_i", children: ["rhachidosorus"] },
    { id: "rhachidosorus", name: "Rhachidosorus", rank: "genus", source: "ppg_i" },
    { id: "diplaziopsidaceae", name: "Diplaziopsidaceae", rank: "family", source: "ppg_i", children: ["diplaziopsis", "homalosorus"] },
    { id: "diplaziopsis", name: "Diplaziopsis", rank: "genus", source: "ppg_i" },
    { id: "homalosorus", name: "Homalosorus", rank: "genus", source: "ppg_i" },
    { id: "desmophlebiaceae", name: "Desmophlebiaceae", rank: "family", source: "ppg_i", children: ["desmophlebium"] },
    { id: "desmophlebium", name: "Desmophlebium", rank: "genus", source: "ppg_i" },
    { id: "hemidictyaceae", name: "Hemidictyaceae", rank: "family", source: "ppg_i", children: ["hemidictyum"] },
    { id: "hemidictyum", name: "Hemidictyum", rank: "genus", source: "ppg_i" },
    { id: "aspleniaceae", name: "Aspleniaceae", rank: "family", source: "ppg_i", children: ["asplenium"] },
    { id: "asplenium", name: "Asplenium", rank: "genus", source: "ppg_i" },
    { id: "woodsiaceae", name: "Woodsiaceae", rank: "family", source: "ppg_i", children: ["woodsia"] },
    { id: "woodsia", name: "Woodsia", rank: "genus", source: "ppg_i" },
    { id: "onocleaceae", name: "Onocleaceae", rank: "family", source: "ppg_i", children: ["onoclea", "matteuccia"] },
    { id: "onoclea", name: "Onoclea", rank: "genus", source: "ppg_i" },
    { id: "matteuccia", name: "Matteuccia", rank: "genus", source: "ppg_i" },
    { id: "blechnaceae", name: "Blechnaceae", rank: "family", source: "ppg_i", children: ["blechnum", "woodwardia"] },
    { id: "blechnum", name: "Blechnum", rank: "genus", source: "ppg_i" },
    { id: "woodwardia", name: "Woodwardia", rank: "genus", source: "ppg_i" },
    { id: "athyriaceae", name: "Athyriaceae", rank: "family", source: "ppg_i", children: ["athyrium", "diplazium"] },
    { id: "athyrium", name: "Athyrium", rank: "genus", source: "ppg_i" },
    { id: "diplazium", name: "Diplazium", rank: "genus", source: "ppg_i" },
    { id: "thelypteridaceae", name: "Thelypteridaceae", rank: "family", source: "ppg_i", children: ["thelypteris", "phegopteris"] },
    { id: "thelypteris", name: "Thelypteris", rank: "genus", source: "ppg_i" },
    { id: "phegopteris", name: "Phegopteris", rank: "genus", source: "ppg_i" },
    { id: "didymochlaenaceae", name: "Didymochlaenaceae", rank: "family", source: "ppg_i", children: ["didymochlaena"] },
    { id: "didymochlaena", name: "Didymochlaena", rank: "genus", source: "ppg_i" },
    { id: "hypodematiaceae", name: "Hypodematiaceae", rank: "family", source: "ppg_i", children: ["hypodematium", "leucostegia"] },
    { id: "hypodematium", name: "Hypodematium", rank: "genus", source: "ppg_i" },
    { id: "leucostegia", name: "Leucostegia", rank: "genus", source: "ppg_i" },
    { id: "dryopteridaceae", name: "Dryopteridaceae", rank: "family", source: "ppg_i", children: ["dryopteris", "polystichum"] },
    { id: "dryopteris", name: "Dryopteris", rank: "genus", source: "ppg_i" },
    { id: "polystichum", name: "Polystichum", rank: "genus", source: "ppg_i" },
    { id: "nephrolepidaceae", name: "Nephrolepidaceae", rank: "family", source: "ppg_i", children: ["nephrolepis"] },
    { id: "nephrolepis", name: "Nephrolepis", rank: "genus", source: "ppg_i" },
    { id: "lomariopsidaceae", name: "Lomariopsidaceae", rank: "family", source: "ppg_i", children: ["lomariopsis"] },
    { id: "lomariopsis", name: "Lomariopsis", rank: "genus", source: "ppg_i" },
    { id: "tectariaceae", name: "Tectariaceae", rank: "family", source: "ppg_i", children: ["tectaria"] },
    { id: "tectaria", name: "Tectaria", rank: "genus", source: "ppg_i" },
    { id: "oleandraceae", name: "Oleandraceae", rank: "family", source: "ppg_i", children: ["oleandra"] },
    { id: "oleandra", name: "Oleandra", rank: "genus", source: "ppg_i" },
    { id: "davalliaceae", name: "Davalliaceae", rank: "family", source: "ppg_i", children: ["davallia"] },
    { id: "davallia", name: "Davallia", rank: "genus", source: "ppg_i" },
    {
      id: "polypodiaceae",
      name: "Polypodiaceae",
      rank: "family",
      source: "ppg_i",
      children: ["polypodium", "platycerium"]
    },
    {
      id: "polypodium",
      name: "Polypodium",
      rank: "genus",
      source: "ppg_i"
    },
    {
      id: "platycerium",
      name: "Platycerium",
      rank: "genus",
      source: "ppg_i"
    },
    {
      id: "seed-plants",
      name: "Seed plants",
      rank: "clade",
      source: "broad_consensus",
      children: ["gymnosperms", "angiosperms"]
    },
    {
      id: "gymnosperms",
      name: "Gymnosperms",
      rank: "grade",
      source: "gymnosperms_2011",
      children: ["cycads", "ginkgos", "gnetophytes", "conifers"]
    },
    {
      id: "cycads",
      name: "Cycads",
      rank: "clade",
      source: "gymnosperms_2011",
      children: ["cycadales"]
    },
    {
      id: "cycadales",
      name: "Cycadales",
      rank: "order",
      source: "gymnosperms_2011",
      children: ["cycadaceae", "zamiaceae"]
    },
    {
      id: "cycadaceae",
      name: "Cycadaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["cycas"]
    },
    {
      id: "cycas",
      name: "Cycas",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "zamiaceae",
      name: "Zamiaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["zamia", "dioon"]
    },
    {
      id: "zamia",
      name: "Zamia",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "dioon",
      name: "Dioon",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "ginkgos",
      name: "Ginkgos",
      rank: "clade",
      source: "gymnosperms_2011",
      children: ["ginkgoales"]
    },
    {
      id: "ginkgoales",
      name: "Ginkgoales",
      rank: "order",
      source: "gymnosperms_2011",
      children: ["ginkgoaceae"]
    },
    {
      id: "ginkgoaceae",
      name: "Ginkgoaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["ginkgo"]
    },
    {
      id: "ginkgo",
      name: "Ginkgo",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "gnetophytes",
      name: "Gnetophytes",
      rank: "clade",
      source: "gymnosperms_2011",
      children: ["welwitschiales", "gnetales", "ephedrales"]
    },
    {
      id: "welwitschiales",
      name: "Welwitschiales",
      rank: "order",
      source: "gymnosperms_2011",
      children: ["welwitschiaceae"]
    },
    {
      id: "welwitschiaceae",
      name: "Welwitschiaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["welwitschia"]
    },
    {
      id: "welwitschia",
      name: "Welwitschia",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "gnetales",
      name: "Gnetales",
      rank: "order",
      source: "gymnosperms_2011",
      children: ["gnetaceae"]
    },
    {
      id: "gnetaceae",
      name: "Gnetaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["gnetum"]
    },
    {
      id: "gnetum",
      name: "Gnetum",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "ephedrales",
      name: "Ephedrales",
      rank: "order",
      source: "gymnosperms_2011",
      children: ["ephedraceae"]
    },
    {
      id: "ephedraceae",
      name: "Ephedraceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["ephedra"]
    },
    {
      id: "ephedra",
      name: "Ephedra",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "conifers",
      name: "Conifers",
      rank: "clade",
      source: "gymnosperms_2011",
      children: ["pinales", "araucariales", "cupressales"]
    },
    {
      id: "pinales",
      name: "Pinales",
      rank: "order",
      source: "gymnosperms_2011",
      children: ["pinaceae"]
    },
    {
      id: "pinaceae",
      name: "Pinaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["pinus", "picea"]
    },
    {
      id: "pinus",
      name: "Pinus",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "picea",
      name: "Picea",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "araucariales",
      name: "Araucariales",
      rank: "order",
      source: "gymnosperms_2011",
      children: ["araucariaceae", "podocarpaceae"]
    },
    {
      id: "araucariaceae",
      name: "Araucariaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["araucaria", "agathis"]
    },
    {
      id: "araucaria",
      name: "Araucaria",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "agathis",
      name: "Agathis",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "podocarpaceae",
      name: "Podocarpaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["podocarpus", "phyllocladus"]
    },
    {
      id: "podocarpus",
      name: "Podocarpus",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "phyllocladus",
      name: "Phyllocladus",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "cupressales",
      name: "Cupressales",
      rank: "order",
      source: "gymnosperms_2011",
      children: ["sciadopityaceae", "cupressaceae", "taxaceae"]
    },
    {
      id: "sciadopityaceae",
      name: "Sciadopityaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["sciadopitys"]
    },
    {
      id: "sciadopitys",
      name: "Sciadopitys",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "cupressaceae",
      name: "Cupressaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["juniperus", "sequoia"]
    },
    {
      id: "juniperus",
      name: "Juniperus",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "sequoia",
      name: "Sequoia",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "taxaceae",
      name: "Taxaceae",
      rank: "family",
      source: "gymnosperms_2011",
      children: ["taxus", "cephalotaxus"]
    },
    {
      id: "taxus",
      name: "Taxus",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "cephalotaxus",
      name: "Cephalotaxus",
      rank: "genus",
      source: "gymnosperms_2011"
    },
    {
      id: "angiosperms",
      name: "Angiosperms",
      rank: "clade",
      source: "apg_iv",
      description: "Flowering plants.",
      children: ["early-angiosperms", "chloranthales", "magnoliids", "monocots", "ceratophyllales", "eudicots"]
    },
    {
      id: "early-angiosperms",
      name: "Early angiosperms",
      rank: "grade",
      source: "apg_iv",
      children: ["amborellales", "nymphaeales", "austrobaileyales"]
    },
    {
      id: "amborellales",
      name: "Amborellales",
      rank: "order",
      source: "apg_iv",
      children: ["amborellaceae"]
    },
    {
      id: "amborellaceae",
      name: "Amborellaceae",
      rank: "family",
      source: "apg_iv",
      children: ["amborella"]
    },
    {
      id: "amborella",
      name: "Amborella",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "nymphaeales",
      name: "Nymphaeales",
      rank: "order",
      source: "apg_iv",
      children: ["cabombaceae", "hydatellaceae", "nymphaeaceae"]
    },
    {
      id: "cabombaceae",
      name: "Cabombaceae",
      rank: "family",
      source: "apg_iv",
      children: ["cabomba"]
    },
    {
      id: "cabomba",
      name: "Cabomba",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "hydatellaceae",
      name: "Hydatellaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "nymphaeaceae",
      name: "Nymphaeaceae",
      rank: "family",
      source: "apg_iv",
      children: ["nymphaea", "victoria"]
    },
    {
      id: "nymphaea",
      name: "Nymphaea",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "victoria",
      name: "Victoria",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "austrobaileyales",
      name: "Austrobaileyales",
      rank: "order",
      source: "apg_iv",
      children: ["austrobaileyaceae", "schisandraceae", "trimeniaceae"]
    },
    {
      id: "austrobaileyaceae",
      name: "Austrobaileyaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "schisandraceae",
      name: "Schisandraceae",
      rank: "family",
      source: "apg_iv",
      children: ["schisandra", "illicium"]
    },
    {
      id: "schisandra",
      name: "Schisandra",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "illicium",
      name: "Illicium",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "trimeniaceae",
      name: "Trimeniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "chloranthales",
      name: "Chloranthales",
      rank: "order",
      source: "apg_iv",
      children: ["chloranthaceae"]
    },
    {
      id: "chloranthaceae",
      name: "Chloranthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "magnoliids",
      name: "Magnoliids",
      rank: "clade",
      source: "apg_iv",
      children: ["canellales", "piperales", "magnoliales", "laurales"]
    },
    {
      id: "canellales",
      name: "Canellales",
      rank: "order",
      source: "apg_iv",
      children: ["canellaceae", "winteraceae"]
    },
    {
      id: "canellaceae",
      name: "Canellaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "winteraceae",
      name: "Winteraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "piperales",
      name: "Piperales",
      rank: "order",
      source: "apg_iv",
      children: ["aristolochiaceae", "piperaceae", "saururaceae"]
    },
    {
      id: "aristolochiaceae",
      name: "Aristolochiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "piperaceae",
      name: "Piperaceae",
      rank: "family",
      source: "apg_iv",
      children: ["piper"]
    },
    {
      id: "piper",
      name: "Piper",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "saururaceae",
      name: "Saururaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "magnoliales",
      name: "Magnoliales",
      rank: "order",
      source: "apg_iv",
      children: ["annonaceae", "degeneriaceae", "eupomatiaceae", "himantandraceae", "magnoliaceae", "myristicaceae"]
    },
    {
      id: "annonaceae",
      name: "Annonaceae",
      rank: "family",
      source: "apg_iv",
      children: ["annona"]
    },
    {
      id: "annona",
      name: "Annona",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "degeneriaceae",
      name: "Degeneriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "eupomatiaceae",
      name: "Eupomatiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "himantandraceae",
      name: "Himantandraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "magnoliaceae",
      name: "Magnoliaceae",
      rank: "family",
      source: "apg_iv",
      children: ["magnolia", "liriodendron"]
    },
    {
      id: "magnolia",
      name: "Magnolia",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "liriodendron",
      name: "Liriodendron",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "myristicaceae",
      name: "Myristicaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "laurales",
      name: "Laurales",
      rank: "order",
      source: "apg_iv",
      children: ["atherospermataceae", "calycanthaceae", "gomortegaceae", "hernandiaceae", "lauraceae", "monimiaceae", "siparunaceae"]
    },
    {
      id: "atherospermataceae",
      name: "Atherospermataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "calycanthaceae",
      name: "Calycanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "gomortegaceae",
      name: "Gomortegaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hernandiaceae",
      name: "Hernandiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lauraceae",
      name: "Lauraceae",
      rank: "family",
      source: "apg_iv",
      children: ["laurus", "persea"]
    },
    {
      id: "laurus",
      name: "Laurus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "persea",
      name: "Persea",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "monimiaceae",
      name: "Monimiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "siparunaceae",
      name: "Siparunaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "monocots",
      name: "Monocots",
      rank: "clade",
      source: "apg_iv",
      children: ["acorales", "alismatales", "petrosaviales", "dioscoreales", "pandanales", "liliales", "asparagales", "arecales", "commelinales", "zingiberales", "poales"]
    },
    {
      id: "acorales",
      name: "Acorales",
      rank: "order",
      source: "apg_iv",
      children: ["acoraceae"]
    },
    {
      id: "acoraceae",
      name: "Acoraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "alismatales",
      name: "Alismatales",
      rank: "order",
      source: "apg_iv",
      children: ["alismataceae", "aponogetonaceae", "araceae", "butomaceae", "cymodoceaceae", "hydrocharitaceae", "juncaginaceae", "maundiaceae", "posidoniaceae", "potamogetonaceae", "ruppiaceae", "scheuchzeriaceae", "tofieldiaceae", "zosteraceae"]
    },
    {
      id: "alismataceae",
      name: "Alismataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "aponogetonaceae",
      name: "Aponogetonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "araceae",
      name: "Araceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "butomaceae",
      name: "Butomaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cymodoceaceae",
      name: "Cymodoceaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hydrocharitaceae",
      name: "Hydrocharitaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "juncaginaceae",
      name: "Juncaginaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "maundiaceae",
      name: "Maundiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "posidoniaceae",
      name: "Posidoniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "potamogetonaceae",
      name: "Potamogetonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ruppiaceae",
      name: "Ruppiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "scheuchzeriaceae",
      name: "Scheuchzeriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tofieldiaceae",
      name: "Tofieldiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "zosteraceae",
      name: "Zosteraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "petrosaviales",
      name: "Petrosaviales",
      rank: "order",
      source: "apg_iv",
      children: ["petrosaviaceae"]
    },
    {
      id: "petrosaviaceae",
      name: "Petrosaviaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "dioscoreales",
      name: "Dioscoreales",
      rank: "order",
      source: "apg_iv",
      children: ["burmanniaceae", "dioscoreaceae", "nartheciaceae"]
    },
    {
      id: "burmanniaceae",
      name: "Burmanniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "dioscoreaceae",
      name: "Dioscoreaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "nartheciaceae",
      name: "Nartheciaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pandanales",
      name: "Pandanales",
      rank: "order",
      source: "apg_iv",
      children: ["cyclanthaceae", "pandanaceae", "stemonaceae", "triuridaceae", "velloziaceae"]
    },
    {
      id: "cyclanthaceae",
      name: "Cyclanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pandanaceae",
      name: "Pandanaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "stemonaceae",
      name: "Stemonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "triuridaceae",
      name: "Triuridaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "velloziaceae",
      name: "Velloziaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "liliales",
      name: "Liliales",
      rank: "order",
      source: "apg_iv",
      children: ["alstroemeriaceae", "campynemataceae", "colchicaceae", "corsiaceae", "liliaceae", "melanthiaceae", "petermanniaceae", "philesiaceae", "ripogonaceae", "smilacaceae"]
    },
    {
      id: "alstroemeriaceae",
      name: "Alstroemeriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "campynemataceae",
      name: "Campynemataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "colchicaceae",
      name: "Colchicaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "corsiaceae",
      name: "Corsiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "liliaceae",
      name: "Liliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "melanthiaceae",
      name: "Melanthiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "petermanniaceae",
      name: "Petermanniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "philesiaceae",
      name: "Philesiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ripogonaceae",
      name: "Ripogonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "smilacaceae",
      name: "Smilacaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "asparagales",
      name: "Asparagales",
      rank: "order",
      source: "apg_iv",
      children: ["amaryllidaceae", "asparagaceae", "asphodelaceae", "asteliaceae", "blandfordiaceae", "boryaceae", "doryanthaceae", "hypoxidaceae", "iridaceae", "ixioliriaceae", "lanariaceae", "orchidaceae", "tecophilaeaceae", "xeronemataceae"]
    },
    {
      id: "amaryllidaceae",
      name: "Amaryllidaceae",
      rank: "family",
      source: "apg_iv",
      children: ["allium", "narcissus"]
    },
    {
      id: "allium",
      name: "Allium",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "narcissus",
      name: "Narcissus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "asparagaceae",
      name: "Asparagaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "asphodelaceae",
      name: "Asphodelaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "asteliaceae",
      name: "Asteliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "blandfordiaceae",
      name: "Blandfordiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "boryaceae",
      name: "Boryaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "doryanthaceae",
      name: "Doryanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hypoxidaceae",
      name: "Hypoxidaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "iridaceae",
      name: "Iridaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ixioliriaceae",
      name: "Ixioliriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lanariaceae",
      name: "Lanariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "orchidaceae",
      name: "Orchidaceae",
      rank: "family",
      source: "apg_iv",
      facts: [
        {
          text: "Orchid flowers commonly have a specialized petal called the lip, or labellum.",
          source: "brit_orchid"
        }
      ],
      children: ["vanilla", "orchis"]
    },
    {
      id: "vanilla",
      name: "Vanilla",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "orchis",
      name: "Orchis",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "tecophilaeaceae",
      name: "Tecophilaeaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "xeronemataceae",
      name: "Xeronemataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "arecales",
      name: "Arecales",
      rank: "order",
      source: "apg_iv",
      children: ["arecaceae", "dasypogonaceae"]
    },
    {
      id: "arecaceae",
      name: "Arecaceae",
      rank: "family",
      source: "apg_iv",
      children: ["cocos", "phoenix"]
    },
    {
      id: "cocos",
      name: "Cocos",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "phoenix",
      name: "Phoenix",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "dasypogonaceae",
      name: "Dasypogonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "commelinales",
      name: "Commelinales",
      rank: "order",
      source: "apg_iv",
      children: ["commelinaceae", "haemodoraceae", "hanguanaceae", "philydraceae", "pontederiaceae"]
    },
    {
      id: "commelinaceae",
      name: "Commelinaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "haemodoraceae",
      name: "Haemodoraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hanguanaceae",
      name: "Hanguanaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "philydraceae",
      name: "Philydraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pontederiaceae",
      name: "Pontederiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "zingiberales",
      name: "Zingiberales",
      rank: "order",
      source: "apg_iv",
      children: ["cannaceae", "costaceae", "heliconiaceae", "lowiaceae", "marantaceae", "musaceae", "strelitziaceae", "zingiberaceae"]
    },
    {
      id: "cannaceae",
      name: "Cannaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "costaceae",
      name: "Costaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "heliconiaceae",
      name: "Heliconiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lowiaceae",
      name: "Lowiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "marantaceae",
      name: "Marantaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "musaceae",
      name: "Musaceae",
      rank: "family",
      source: "apg_iv",
      children: ["musa"]
    },
    {
      id: "musa",
      name: "Musa",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "strelitziaceae",
      name: "Strelitziaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "zingiberaceae",
      name: "Zingiberaceae",
      rank: "family",
      source: "apg_iv",
      children: ["zingiber", "curcuma"]
    },
    {
      id: "zingiber",
      name: "Zingiber",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "curcuma",
      name: "Curcuma",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "poales",
      name: "Poales",
      rank: "order",
      source: "apg_iv",
      children: ["bromeliaceae", "cyperaceae", "ecdeiocoleaceae", "eriocaulaceae", "flagellariaceae", "joinvilleaceae", "juncaceae", "mayacaceae", "poaceae", "rapateaceae", "restionaceae", "thurniaceae", "typhaceae", "xyridaceae"]
    },
    {
      id: "bromeliaceae",
      name: "Bromeliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cyperaceae",
      name: "Cyperaceae",
      rank: "family",
      source: "apg_iv",
      children: ["carex", "cyperus"]
    },
    {
      id: "carex",
      name: "Carex",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "cyperus",
      name: "Cyperus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "ecdeiocoleaceae",
      name: "Ecdeiocoleaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "eriocaulaceae",
      name: "Eriocaulaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "flagellariaceae",
      name: "Flagellariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "joinvilleaceae",
      name: "Joinvilleaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "juncaceae",
      name: "Juncaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "mayacaceae",
      name: "Mayacaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "poaceae",
      name: "Poaceae",
      rank: "family",
      source: "apg_iv",
      children: ["zea", "oryza"]
    },
    {
      id: "zea",
      name: "Zea",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "oryza",
      name: "Oryza",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "rapateaceae",
      name: "Rapateaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "restionaceae",
      name: "Restionaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "thurniaceae",
      name: "Thurniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "typhaceae",
      name: "Typhaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "xyridaceae",
      name: "Xyridaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ceratophyllales",
      name: "Ceratophyllales",
      rank: "order",
      source: "apg_iv",
      children: ["ceratophyllaceae"]
    },
    {
      id: "ceratophyllaceae",
      name: "Ceratophyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "eudicots",
      name: "Eudicots",
      rank: "clade",
      source: "apg_iv",
      children: ["early-eudicots", "core-eudicots"]
    },
    {
      id: "early-eudicots",
      name: "Early eudicots",
      rank: "grade",
      source: "apg_iv",
      children: ["ranunculales", "proteales", "trochodendrales", "buxales"]
    },
    {
      id: "ranunculales",
      name: "Ranunculales",
      rank: "order",
      source: "apg_iv",
      children: ["berberidaceae", "circaeasteraceae", "eupteleaceae", "lardizabalaceae", "menispermaceae", "papaveraceae", "ranunculaceae"]
    },
    {
      id: "berberidaceae",
      name: "Berberidaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "circaeasteraceae",
      name: "Circaeasteraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "eupteleaceae",
      name: "Eupteleaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lardizabalaceae",
      name: "Lardizabalaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "menispermaceae",
      name: "Menispermaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "papaveraceae",
      name: "Papaveraceae",
      rank: "family",
      source: "apg_iv",
      children: ["papaver"]
    },
    {
      id: "papaver",
      name: "Papaver",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "ranunculaceae",
      name: "Ranunculaceae",
      rank: "family",
      source: "apg_iv",
      children: ["ranunculus", "clematis"]
    },
    {
      id: "ranunculus",
      name: "Ranunculus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "clematis",
      name: "Clematis",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "proteales",
      name: "Proteales",
      rank: "order",
      source: "apg_iv",
      children: ["nelumbonaceae", "platanaceae", "proteaceae", "sabiaceae"]
    },
    {
      id: "nelumbonaceae",
      name: "Nelumbonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "platanaceae",
      name: "Platanaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "proteaceae",
      name: "Proteaceae",
      rank: "family",
      source: "apg_iv",
      children: ["banksia", "protea"]
    },
    {
      id: "banksia",
      name: "Banksia",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "protea",
      name: "Protea",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "sabiaceae",
      name: "Sabiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "trochodendrales",
      name: "Trochodendrales",
      rank: "order",
      source: "apg_iv",
      children: ["trochodendraceae"]
    },
    {
      id: "trochodendraceae",
      name: "Trochodendraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "buxales",
      name: "Buxales",
      rank: "order",
      source: "apg_iv",
      children: ["buxaceae"]
    },
    {
      id: "buxaceae",
      name: "Buxaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "core-eudicots",
      name: "Core eudicots",
      rank: "clade",
      source: "apg_iv",
      children: ["gunnerales", "dilleniales", "superrosids", "superasterids"]
    },
    {
      id: "gunnerales",
      name: "Gunnerales",
      rank: "order",
      source: "apg_iv",
      children: ["gunneraceae", "myrothamnaceae"]
    },
    {
      id: "gunneraceae",
      name: "Gunneraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "myrothamnaceae",
      name: "Myrothamnaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "dilleniales",
      name: "Dilleniales",
      rank: "order",
      source: "apg_iv",
      children: ["dilleniaceae"]
    },
    {
      id: "dilleniaceae",
      name: "Dilleniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "superrosids",
      name: "Superrosids",
      rank: "clade",
      source: "apg_iv",
      children: ["saxifragales", "vitales", "rosids"]
    },
    {
      id: "saxifragales",
      name: "Saxifragales",
      rank: "order",
      source: "apg_iv",
      children: ["altingiaceae", "aphanopetalaceae", "cercidiphyllaceae", "crassulaceae", "cynomoriaceae", "daphniphyllaceae", "grossulariaceae", "haloragaceae", "hamamelidaceae", "iteaceae", "paeoniaceae", "penthoraceae", "peridiscaceae", "saxifragaceae", "tetracarpaeaceae"]
    },
    {
      id: "altingiaceae",
      name: "Altingiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "aphanopetalaceae",
      name: "Aphanopetalaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cercidiphyllaceae",
      name: "Cercidiphyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "crassulaceae",
      name: "Crassulaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cynomoriaceae",
      name: "Cynomoriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "daphniphyllaceae",
      name: "Daphniphyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "grossulariaceae",
      name: "Grossulariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "haloragaceae",
      name: "Haloragaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hamamelidaceae",
      name: "Hamamelidaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "iteaceae",
      name: "Iteaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "paeoniaceae",
      name: "Paeoniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "penthoraceae",
      name: "Penthoraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "peridiscaceae",
      name: "Peridiscaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "saxifragaceae",
      name: "Saxifragaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tetracarpaeaceae",
      name: "Tetracarpaeaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "vitales",
      name: "Vitales",
      rank: "order",
      source: "apg_iv",
      children: ["vitaceae"]
    },
    {
      id: "vitaceae",
      name: "Vitaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rosids",
      name: "Rosids",
      rank: "clade",
      source: "apg_iv",
      children: ["zygophyllales", "fabids", "malvids"]
    },
    {
      id: "zygophyllales",
      name: "Zygophyllales",
      rank: "order",
      source: "apg_iv",
      children: ["krameriaceae", "zygophyllaceae"]
    },
    {
      id: "krameriaceae",
      name: "Krameriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "zygophyllaceae",
      name: "Zygophyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "fabids",
      name: "Fabids",
      rank: "clade",
      source: "apg_iv",
      children: ["fabales", "rosales", "fagales", "cucurbitales", "oxalidales", "malpighiales", "celastrales"]
    },
    {
      id: "fabales",
      name: "Fabales",
      rank: "order",
      source: "apg_iv",
      children: ["fabaceae", "polygalaceae", "quillajaceae", "surianaceae"]
    },
    {
      id: "fabaceae",
      name: "Fabaceae",
      rank: "family",
      source: "apg_iv",
      children: ["pisum", "acacia"]
    },
    {
      id: "pisum",
      name: "Pisum",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "acacia",
      name: "Acacia",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "polygalaceae",
      name: "Polygalaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "quillajaceae",
      name: "Quillajaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "surianaceae",
      name: "Surianaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rosales",
      name: "Rosales",
      rank: "order",
      source: "apg_iv",
      children: ["barbeyaceae", "cannabaceae", "dirachmaceae", "elaeagnaceae", "moraceae", "rhamnaceae", "rosaceae", "ulmaceae", "urticaceae"]
    },
    {
      id: "barbeyaceae",
      name: "Barbeyaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cannabaceae",
      name: "Cannabaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "dirachmaceae",
      name: "Dirachmaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "elaeagnaceae",
      name: "Elaeagnaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "moraceae",
      name: "Moraceae",
      rank: "family",
      source: "apg_iv",
      children: ["ficus", "morus"]
    },
    {
      id: "ficus",
      name: "Ficus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "morus",
      name: "Morus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "rhamnaceae",
      name: "Rhamnaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rosaceae",
      name: "Rosaceae",
      rank: "family",
      source: "apg_iv",
      children: ["rosa", "malus"]
    },
    {
      id: "rosa",
      name: "Rosa",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "malus",
      name: "Malus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "ulmaceae",
      name: "Ulmaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "urticaceae",
      name: "Urticaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "fagales",
      name: "Fagales",
      rank: "order",
      source: "apg_iv",
      children: ["betulaceae", "casuarinaceae", "fagaceae", "juglandaceae", "myricaceae", "nothofagaceae", "ticodendraceae"]
    },
    {
      id: "betulaceae",
      name: "Betulaceae",
      rank: "family",
      source: "apg_iv",
      children: ["betula", "alnus"]
    },
    {
      id: "betula",
      name: "Betula",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "alnus",
      name: "Alnus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "casuarinaceae",
      name: "Casuarinaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "fagaceae",
      name: "Fagaceae",
      rank: "family",
      source: "apg_iv",
      children: ["quercus", "fagus"]
    },
    {
      id: "quercus",
      name: "Quercus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "fagus",
      name: "Fagus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "juglandaceae",
      name: "Juglandaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "myricaceae",
      name: "Myricaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "nothofagaceae",
      name: "Nothofagaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ticodendraceae",
      name: "Ticodendraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cucurbitales",
      name: "Cucurbitales",
      rank: "order",
      source: "apg_iv",
      children: ["anisophylleaceae", "apodanthaceae", "begoniaceae", "coriariaceae", "corynocarpaceae", "cucurbitaceae", "datiscaceae", "tetramelaceae"]
    },
    {
      id: "anisophylleaceae",
      name: "Anisophylleaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "apodanthaceae",
      name: "Apodanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "begoniaceae",
      name: "Begoniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "coriariaceae",
      name: "Coriariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "corynocarpaceae",
      name: "Corynocarpaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cucurbitaceae",
      name: "Cucurbitaceae",
      rank: "family",
      source: "apg_iv",
      children: ["cucurbita", "cucumis"]
    },
    {
      id: "cucurbita",
      name: "Cucurbita",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "cucumis",
      name: "Cucumis",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "datiscaceae",
      name: "Datiscaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tetramelaceae",
      name: "Tetramelaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "oxalidales",
      name: "Oxalidales",
      rank: "order",
      source: "apg_iv",
      children: ["brunelliaceae", "cephalotaceae", "connaraceae", "cunoniaceae", "elaeocarpaceae", "huaceae", "oxalidaceae"]
    },
    {
      id: "brunelliaceae",
      name: "Brunelliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cephalotaceae",
      name: "Cephalotaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "connaraceae",
      name: "Connaraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cunoniaceae",
      name: "Cunoniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "elaeocarpaceae",
      name: "Elaeocarpaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "huaceae",
      name: "Huaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "oxalidaceae",
      name: "Oxalidaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "malpighiales",
      name: "Malpighiales",
      rank: "order",
      source: "apg_iv",
      children: ["achariaceae", "balanopaceae", "bonnetiaceae", "calophyllaceae", "caryocaraceae", "centroplacaceae", "chrysobalanaceae", "clusiaceae", "ctenolophonaceae", "dichapetalaceae", "elatinaceae", "erythroxylaceae", "euphorbiaceae", "euphroniaceae", "goupiaceae", "humiriaceae", "hypericaceae", "irvingiaceae", "ixonanthaceae", "lacistemataceae", "linaceae", "lophopyxidaceae", "malpighiaceae", "ochnaceae", "pandaceae", "passifloraceae", "peraceae", "phyllanthaceae", "picrodendraceae", "podostemaceae", "putranjivaceae", "rafflesiaceae", "rhizophoraceae", "salicaceae", "trigoniaceae", "violaceae"]
    },
    {
      id: "achariaceae",
      name: "Achariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "balanopaceae",
      name: "Balanopaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "bonnetiaceae",
      name: "Bonnetiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "calophyllaceae",
      name: "Calophyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "caryocaraceae",
      name: "Caryocaraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "centroplacaceae",
      name: "Centroplacaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "chrysobalanaceae",
      name: "Chrysobalanaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "clusiaceae",
      name: "Clusiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ctenolophonaceae",
      name: "Ctenolophonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "dichapetalaceae",
      name: "Dichapetalaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "elatinaceae",
      name: "Elatinaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "erythroxylaceae",
      name: "Erythroxylaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "euphorbiaceae",
      name: "Euphorbiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "euphroniaceae",
      name: "Euphroniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "goupiaceae",
      name: "Goupiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "humiriaceae",
      name: "Humiriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hypericaceae",
      name: "Hypericaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "irvingiaceae",
      name: "Irvingiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ixonanthaceae",
      name: "Ixonanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lacistemataceae",
      name: "Lacistemataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "linaceae",
      name: "Linaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lophopyxidaceae",
      name: "Lophopyxidaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "malpighiaceae",
      name: "Malpighiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ochnaceae",
      name: "Ochnaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pandaceae",
      name: "Pandaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "passifloraceae",
      name: "Passifloraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "peraceae",
      name: "Peraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "phyllanthaceae",
      name: "Phyllanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "picrodendraceae",
      name: "Picrodendraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "podostemaceae",
      name: "Podostemaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "putranjivaceae",
      name: "Putranjivaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rafflesiaceae",
      name: "Rafflesiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rhizophoraceae",
      name: "Rhizophoraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "salicaceae",
      name: "Salicaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "trigoniaceae",
      name: "Trigoniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "violaceae",
      name: "Violaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "celastrales",
      name: "Celastrales",
      rank: "order",
      source: "apg_iv",
      children: ["celastraceae", "lepidobotryaceae"]
    },
    {
      id: "celastraceae",
      name: "Celastraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lepidobotryaceae",
      name: "Lepidobotryaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "malvids",
      name: "Malvids",
      rank: "clade",
      source: "apg_iv",
      children: ["geraniales", "myrtales", "crossosomatales", "picramniales", "sapindales", "huerteales", "brassicales", "malvales"]
    },
    {
      id: "geraniales",
      name: "Geraniales",
      rank: "order",
      source: "apg_iv",
      children: ["francoaceae", "geraniaceae"]
    },
    {
      id: "francoaceae",
      name: "Francoaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "geraniaceae",
      name: "Geraniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "myrtales",
      name: "Myrtales",
      rank: "order",
      source: "apg_iv",
      children: ["alzateaceae", "combretaceae", "crypteroniaceae", "lythraceae", "melastomataceae", "myrtaceae", "onagraceae", "penaeaceae", "vochysiaceae"]
    },
    {
      id: "alzateaceae",
      name: "Alzateaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "combretaceae",
      name: "Combretaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "crypteroniaceae",
      name: "Crypteroniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lythraceae",
      name: "Lythraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "melastomataceae",
      name: "Melastomataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "myrtaceae",
      name: "Myrtaceae",
      rank: "family",
      source: "apg_iv",
      children: ["eucalyptus", "myrtus"]
    },
    {
      id: "eucalyptus",
      name: "Eucalyptus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "myrtus",
      name: "Myrtus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "onagraceae",
      name: "Onagraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "penaeaceae",
      name: "Penaeaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "vochysiaceae",
      name: "Vochysiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "crossosomatales",
      name: "Crossosomatales",
      rank: "order",
      source: "apg_iv",
      children: ["aphloiaceae", "crossosomataceae", "geissolomataceae", "guamatelaceae", "stachyuraceae", "staphyleaceae", "strasburgeriaceae"]
    },
    {
      id: "aphloiaceae",
      name: "Aphloiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "crossosomataceae",
      name: "Crossosomataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "geissolomataceae",
      name: "Geissolomataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "guamatelaceae",
      name: "Guamatelaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "stachyuraceae",
      name: "Stachyuraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "staphyleaceae",
      name: "Staphyleaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "strasburgeriaceae",
      name: "Strasburgeriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "picramniales",
      name: "Picramniales",
      rank: "order",
      source: "apg_iv",
      children: ["picramniaceae"]
    },
    {
      id: "picramniaceae",
      name: "Picramniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "sapindales",
      name: "Sapindales",
      rank: "order",
      source: "apg_iv",
      children: ["anacardiaceae", "biebersteiniaceae", "burseraceae", "kirkiaceae", "meliaceae", "nitrariaceae", "rutaceae", "sapindaceae", "simaroubaceae"]
    },
    {
      id: "anacardiaceae",
      name: "Anacardiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "biebersteiniaceae",
      name: "Biebersteiniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "burseraceae",
      name: "Burseraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "kirkiaceae",
      name: "Kirkiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "meliaceae",
      name: "Meliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "nitrariaceae",
      name: "Nitrariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rutaceae",
      name: "Rutaceae",
      rank: "family",
      source: "apg_iv",
      children: ["citrus"]
    },
    {
      id: "citrus",
      name: "Citrus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "sapindaceae",
      name: "Sapindaceae",
      rank: "family",
      source: "apg_iv",
      children: ["acer", "aesculus"]
    },
    {
      id: "acer",
      name: "Acer",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "aesculus",
      name: "Aesculus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "simaroubaceae",
      name: "Simaroubaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "huerteales",
      name: "Huerteales",
      rank: "order",
      source: "apg_iv",
      children: ["dipentodontaceae", "gerrardinaceae", "petenaeaceae", "tapisciaceae"]
    },
    {
      id: "dipentodontaceae",
      name: "Dipentodontaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "gerrardinaceae",
      name: "Gerrardinaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "petenaeaceae",
      name: "Petenaeaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tapisciaceae",
      name: "Tapisciaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "brassicales",
      name: "Brassicales",
      rank: "order",
      source: "apg_iv",
      children: ["akaniaceae", "bataceae", "brassicaceae", "capparaceae", "caricaceae", "cleomaceae", "emblingiaceae", "gyrostemonaceae", "koeberliniaceae", "limnanthaceae", "moringaceae", "pentadiplandraceae", "resedaceae", "salvadoraceae", "setchellanthaceae", "tovariaceae", "tropaeolaceae"]
    },
    {
      id: "akaniaceae",
      name: "Akaniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "bataceae",
      name: "Bataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "brassicaceae",
      name: "Brassicaceae",
      rank: "family",
      source: "apg_iv",
      children: ["brassica", "arabidopsis"]
    },
    {
      id: "brassica",
      name: "Brassica",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "arabidopsis",
      name: "Arabidopsis",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "capparaceae",
      name: "Capparaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "caricaceae",
      name: "Caricaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cleomaceae",
      name: "Cleomaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "emblingiaceae",
      name: "Emblingiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "gyrostemonaceae",
      name: "Gyrostemonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "koeberliniaceae",
      name: "Koeberliniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "limnanthaceae",
      name: "Limnanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "moringaceae",
      name: "Moringaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pentadiplandraceae",
      name: "Pentadiplandraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "resedaceae",
      name: "Resedaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "salvadoraceae",
      name: "Salvadoraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "setchellanthaceae",
      name: "Setchellanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tovariaceae",
      name: "Tovariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tropaeolaceae",
      name: "Tropaeolaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "malvales",
      name: "Malvales",
      rank: "order",
      source: "apg_iv",
      children: ["bixaceae", "cistaceae", "cytinaceae", "dipterocarpaceae", "malvaceae", "muntingiaceae", "neuradaceae", "sarcolaenaceae", "sphaerosepalaceae", "thymelaeaceae"]
    },
    {
      id: "bixaceae",
      name: "Bixaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cistaceae",
      name: "Cistaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cytinaceae",
      name: "Cytinaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "dipterocarpaceae",
      name: "Dipterocarpaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "malvaceae",
      name: "Malvaceae",
      rank: "family",
      source: "apg_iv",
      children: ["hibiscus", "theobroma"]
    },
    {
      id: "hibiscus",
      name: "Hibiscus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "theobroma",
      name: "Theobroma",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "muntingiaceae",
      name: "Muntingiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "neuradaceae",
      name: "Neuradaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "sarcolaenaceae",
      name: "Sarcolaenaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "sphaerosepalaceae",
      name: "Sphaerosepalaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "thymelaeaceae",
      name: "Thymelaeaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "superasterids",
      name: "Superasterids",
      rank: "clade",
      source: "apg_iv",
      children: ["berberidopsidales", "santalales", "caryophyllales", "asterids"]
    },
    {
      id: "berberidopsidales",
      name: "Berberidopsidales",
      rank: "order",
      source: "apg_iv",
      children: ["aextoxicaceae", "berberidopsidaceae"]
    },
    {
      id: "aextoxicaceae",
      name: "Aextoxicaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "berberidopsidaceae",
      name: "Berberidopsidaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "santalales",
      name: "Santalales",
      rank: "order",
      source: "apg_iv",
      children: ["balanophoraceae", "loranthaceae", "misodendraceae", "olacaceae", "opiliaceae", "santalaceae", "schoepfiaceae"]
    },
    {
      id: "balanophoraceae",
      name: "Balanophoraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "loranthaceae",
      name: "Loranthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "misodendraceae",
      name: "Misodendraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "olacaceae",
      name: "Olacaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "opiliaceae",
      name: "Opiliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "santalaceae",
      name: "Santalaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "schoepfiaceae",
      name: "Schoepfiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "caryophyllales",
      name: "Caryophyllales",
      rank: "order",
      source: "apg_iv",
      children: ["achatocarpaceae", "aizoaceae", "amaranthaceae", "anacampserotaceae", "ancistrocladaceae", "asteropeiaceae", "barbeuiaceae", "basellaceae", "cactaceae", "caryophyllaceae", "didiereaceae", "dioncophyllaceae", "droseraceae", "drosophyllaceae", "frankeniaceae", "gisekiaceae", "halophytaceae", "kewaceae", "limeaceae", "lophiocarpaceae", "macarthuriaceae", "microteaceae", "molluginaceae", "montiaceae", "nepenthaceae", "nyctaginaceae", "petiveriaceae", "physenaceae", "phytolaccaceae", "plumbaginaceae", "polygonaceae", "portulacaceae", "rhabdodendraceae", "sarcobataceae", "simmondsiaceae", "stegnospermataceae", "talinaceae", "tamaricaceae"]
    },
    {
      id: "achatocarpaceae",
      name: "Achatocarpaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "aizoaceae",
      name: "Aizoaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "amaranthaceae",
      name: "Amaranthaceae",
      rank: "family",
      source: "apg_iv",
      children: ["amaranthus", "spinacia"]
    },
    {
      id: "amaranthus",
      name: "Amaranthus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "spinacia",
      name: "Spinacia",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "anacampserotaceae",
      name: "Anacampserotaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ancistrocladaceae",
      name: "Ancistrocladaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "asteropeiaceae",
      name: "Asteropeiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "barbeuiaceae",
      name: "Barbeuiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "basellaceae",
      name: "Basellaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cactaceae",
      name: "Cactaceae",
      rank: "family",
      source: "apg_iv",
      children: ["opuntia", "carnegiea"]
    },
    {
      id: "opuntia",
      name: "Opuntia",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "carnegiea",
      name: "Carnegiea",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "caryophyllaceae",
      name: "Caryophyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "didiereaceae",
      name: "Didiereaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "dioncophyllaceae",
      name: "Dioncophyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "droseraceae",
      name: "Droseraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "drosophyllaceae",
      name: "Drosophyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "frankeniaceae",
      name: "Frankeniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "gisekiaceae",
      name: "Gisekiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "halophytaceae",
      name: "Halophytaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "kewaceae",
      name: "Kewaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "limeaceae",
      name: "Limeaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lophiocarpaceae",
      name: "Lophiocarpaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "macarthuriaceae",
      name: "Macarthuriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "microteaceae",
      name: "Microteaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "molluginaceae",
      name: "Molluginaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "montiaceae",
      name: "Montiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "nepenthaceae",
      name: "Nepenthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "nyctaginaceae",
      name: "Nyctaginaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "petiveriaceae",
      name: "Petiveriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "physenaceae",
      name: "Physenaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "phytolaccaceae",
      name: "Phytolaccaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "plumbaginaceae",
      name: "Plumbaginaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "polygonaceae",
      name: "Polygonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "portulacaceae",
      name: "Portulacaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rhabdodendraceae",
      name: "Rhabdodendraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "sarcobataceae",
      name: "Sarcobataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "simmondsiaceae",
      name: "Simmondsiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "stegnospermataceae",
      name: "Stegnospermataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "talinaceae",
      name: "Talinaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tamaricaceae",
      name: "Tamaricaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "asterids",
      name: "Asterids",
      rank: "clade",
      source: "apg_iv",
      children: ["cornales", "ericales", "lamiids", "campanulids"]
    },
    {
      id: "cornales",
      name: "Cornales",
      rank: "order",
      source: "apg_iv",
      children: ["cornaceae", "curtisiaceae", "grubbiaceae", "hydrangeaceae", "hydrostachyaceae", "loasaceae", "nyssaceae"]
    },
    {
      id: "cornaceae",
      name: "Cornaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "curtisiaceae",
      name: "Curtisiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "grubbiaceae",
      name: "Grubbiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hydrangeaceae",
      name: "Hydrangeaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hydrostachyaceae",
      name: "Hydrostachyaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "loasaceae",
      name: "Loasaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "nyssaceae",
      name: "Nyssaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ericales",
      name: "Ericales",
      rank: "order",
      source: "apg_iv",
      children: ["actinidiaceae", "balsaminaceae", "clethraceae", "cyrillaceae", "diapensiaceae", "ebenaceae", "ericaceae", "fouquieriaceae", "lecythidaceae", "marcgraviaceae", "mitrastemonaceae", "pentaphylacaceae", "polemoniaceae", "primulaceae", "roridulaceae", "sapotaceae", "sarraceniaceae", "sladeniaceae", "styracaceae", "symplocaceae", "tetrameristaceae", "theaceae"]
    },
    {
      id: "actinidiaceae",
      name: "Actinidiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "balsaminaceae",
      name: "Balsaminaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "clethraceae",
      name: "Clethraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cyrillaceae",
      name: "Cyrillaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "diapensiaceae",
      name: "Diapensiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ebenaceae",
      name: "Ebenaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "ericaceae",
      name: "Ericaceae",
      rank: "family",
      source: "apg_iv",
      children: ["rhododendron", "vaccinium"]
    },
    {
      id: "rhododendron",
      name: "Rhododendron",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "vaccinium",
      name: "Vaccinium",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "fouquieriaceae",
      name: "Fouquieriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lecythidaceae",
      name: "Lecythidaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "marcgraviaceae",
      name: "Marcgraviaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "mitrastemonaceae",
      name: "Mitrastemonaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pentaphylacaceae",
      name: "Pentaphylacaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "polemoniaceae",
      name: "Polemoniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "primulaceae",
      name: "Primulaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "roridulaceae",
      name: "Roridulaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "sapotaceae",
      name: "Sapotaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "sarraceniaceae",
      name: "Sarraceniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "sladeniaceae",
      name: "Sladeniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "styracaceae",
      name: "Styracaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "symplocaceae",
      name: "Symplocaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tetrameristaceae",
      name: "Tetrameristaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "theaceae",
      name: "Theaceae",
      rank: "family",
      source: "apg_iv",
      children: ["camellia"]
    },
    {
      id: "camellia",
      name: "Camellia",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "lamiids",
      name: "Lamiids",
      rank: "clade",
      source: "apg_iv",
      children: ["garryales", "gentianales", "boraginales", "vahliales", "solanales", "lamiales", "icacinales", "metteniusales"]
    },
    {
      id: "garryales",
      name: "Garryales",
      rank: "order",
      source: "apg_iv",
      children: ["eucommiaceae", "garryaceae"]
    },
    {
      id: "eucommiaceae",
      name: "Eucommiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "garryaceae",
      name: "Garryaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "gentianales",
      name: "Gentianales",
      rank: "order",
      source: "apg_iv",
      children: ["apocynaceae", "gelsemiaceae", "gentianaceae", "loganiaceae", "rubiaceae"]
    },
    {
      id: "apocynaceae",
      name: "Apocynaceae",
      rank: "family",
      source: "apg_iv",
      children: ["asclepias", "vinca"]
    },
    {
      id: "asclepias",
      name: "Asclepias",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "vinca",
      name: "Vinca",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "gelsemiaceae",
      name: "Gelsemiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "gentianaceae",
      name: "Gentianaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "loganiaceae",
      name: "Loganiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rubiaceae",
      name: "Rubiaceae",
      rank: "family",
      source: "apg_iv",
      children: ["coffea", "gardenia"]
    },
    {
      id: "coffea",
      name: "Coffea",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "gardenia",
      name: "Gardenia",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "boraginales",
      name: "Boraginales",
      rank: "order",
      source: "apg_iv",
      children: ["boraginaceae"]
    },
    {
      id: "boraginaceae",
      name: "Boraginaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "vahliales",
      name: "Vahliales",
      rank: "order",
      source: "apg_iv",
      children: ["vahliaceae"]
    },
    {
      id: "vahliaceae",
      name: "Vahliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "solanales",
      name: "Solanales",
      rank: "order",
      source: "apg_iv",
      children: ["convolvulaceae", "hydroleaceae", "montiniaceae", "solanaceae", "sphenocleaceae"]
    },
    {
      id: "convolvulaceae",
      name: "Convolvulaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "hydroleaceae",
      name: "Hydroleaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "montiniaceae",
      name: "Montiniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "solanaceae",
      name: "Solanaceae",
      rank: "family",
      source: "apg_iv",
      children: ["solanum", "capsicum"]
    },
    {
      id: "solanum",
      name: "Solanum",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "capsicum",
      name: "Capsicum",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "sphenocleaceae",
      name: "Sphenocleaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lamiales",
      name: "Lamiales",
      rank: "order",
      source: "apg_iv",
      children: ["acanthaceae", "bignoniaceae", "byblidaceae", "calceolariaceae", "carlemanniaceae", "gesneriaceae", "lamiaceae", "lentibulariaceae", "linderniaceae", "martyniaceae", "mazaceae", "oleaceae", "orobanchaceae", "paulowniaceae", "pedaliaceae", "phrymaceae", "plantaginaceae", "plocospermataceae", "schlegeliaceae", "scrophulariaceae", "stilbaceae", "tetrachondraceae", "thomandersiaceae", "verbenaceae"]
    },
    {
      id: "acanthaceae",
      name: "Acanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "bignoniaceae",
      name: "Bignoniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "byblidaceae",
      name: "Byblidaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "calceolariaceae",
      name: "Calceolariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "carlemanniaceae",
      name: "Carlemanniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "gesneriaceae",
      name: "Gesneriaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "lamiaceae",
      name: "Lamiaceae",
      rank: "family",
      source: "apg_iv",
      children: ["mentha", "salvia"]
    },
    {
      id: "mentha",
      name: "Mentha",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "salvia",
      name: "Salvia",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "lentibulariaceae",
      name: "Lentibulariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "linderniaceae",
      name: "Linderniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "martyniaceae",
      name: "Martyniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "mazaceae",
      name: "Mazaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "oleaceae",
      name: "Oleaceae",
      rank: "family",
      source: "apg_iv",
      children: ["olea", "fraxinus"]
    },
    {
      id: "olea",
      name: "Olea",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "fraxinus",
      name: "Fraxinus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "orobanchaceae",
      name: "Orobanchaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "paulowniaceae",
      name: "Paulowniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pedaliaceae",
      name: "Pedaliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "phrymaceae",
      name: "Phrymaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "plantaginaceae",
      name: "Plantaginaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "plocospermataceae",
      name: "Plocospermataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "schlegeliaceae",
      name: "Schlegeliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "scrophulariaceae",
      name: "Scrophulariaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "stilbaceae",
      name: "Stilbaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "tetrachondraceae",
      name: "Tetrachondraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "thomandersiaceae",
      name: "Thomandersiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "verbenaceae",
      name: "Verbenaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "icacinales",
      name: "Icacinales",
      rank: "order",
      source: "apg_iv",
      children: ["icacinaceae", "oncothecaceae"]
    },
    {
      id: "icacinaceae",
      name: "Icacinaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "oncothecaceae",
      name: "Oncothecaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "metteniusales",
      name: "Metteniusales",
      rank: "order",
      source: "apg_iv",
      children: ["metteniusaceae"]
    },
    {
      id: "metteniusaceae",
      name: "Metteniusaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "campanulids",
      name: "Campanulids",
      rank: "clade",
      source: "apg_iv",
      children: ["aquifoliales", "asterales", "escalloniales", "bruniales", "paracryphiales", "dipsacales", "apiales"]
    },
    {
      id: "aquifoliales",
      name: "Aquifoliales",
      rank: "order",
      source: "apg_iv",
      children: ["aquifoliaceae", "cardiopteridaceae", "helwingiaceae", "phyllonomaceae", "stemonuraceae"]
    },
    {
      id: "aquifoliaceae",
      name: "Aquifoliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "cardiopteridaceae",
      name: "Cardiopteridaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "helwingiaceae",
      name: "Helwingiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "phyllonomaceae",
      name: "Phyllonomaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "stemonuraceae",
      name: "Stemonuraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "asterales",
      name: "Asterales",
      rank: "order",
      source: "apg_iv",
      children: ["alseuosmiaceae", "argophyllaceae", "asteraceae", "calyceraceae", "campanulaceae", "goodeniaceae", "menyanthaceae", "pentaphragmataceae", "phellinaceae", "rousseaceae", "stylidiaceae"]
    },
    {
      id: "alseuosmiaceae",
      name: "Alseuosmiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "argophyllaceae",
      name: "Argophyllaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "asteraceae",
      name: "Asteraceae",
      rank: "family",
      source: "apg_iv",
      facts: [
        {
          text: "Asteraceae flower heads are inflorescences composed of many small flowers rather than a single flower.",
          source: "brit_asteraceae"
        }
      ],
      children: ["helianthus", "taraxacum"]
    },
    {
      id: "helianthus",
      name: "Helianthus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "taraxacum",
      name: "Taraxacum",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "calyceraceae",
      name: "Calyceraceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "campanulaceae",
      name: "Campanulaceae",
      rank: "family",
      source: "apg_iv",
      children: ["campanula"]
    },
    {
      id: "campanula",
      name: "Campanula",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "goodeniaceae",
      name: "Goodeniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "menyanthaceae",
      name: "Menyanthaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pentaphragmataceae",
      name: "Pentaphragmataceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "phellinaceae",
      name: "Phellinaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "rousseaceae",
      name: "Rousseaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "stylidiaceae",
      name: "Stylidiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "escalloniales",
      name: "Escalloniales",
      rank: "order",
      source: "apg_iv",
      children: ["escalloniaceae"]
    },
    {
      id: "escalloniaceae",
      name: "Escalloniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "bruniales",
      name: "Bruniales",
      rank: "order",
      source: "apg_iv",
      children: ["bruniaceae", "columelliaceae"]
    },
    {
      id: "bruniaceae",
      name: "Bruniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "columelliaceae",
      name: "Columelliaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "paracryphiales",
      name: "Paracryphiales",
      rank: "order",
      source: "apg_iv",
      children: ["paracryphiaceae"]
    },
    {
      id: "paracryphiaceae",
      name: "Paracryphiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "dipsacales",
      name: "Dipsacales",
      rank: "order",
      source: "apg_iv",
      children: ["adoxaceae", "caprifoliaceae"]
    },
    {
      id: "adoxaceae",
      name: "Adoxaceae",
      rank: "family",
      source: "apg_iv",
      searchAliases: ["Viburnaceae"]
    },
    {
      id: "caprifoliaceae",
      name: "Caprifoliaceae",
      rank: "family",
      source: "apg_iv",
      children: ["lonicera", "sambucus"]
    },
    {
      id: "lonicera",
      name: "Lonicera",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "sambucus",
      name: "Sambucus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "apiales",
      name: "Apiales",
      rank: "order",
      source: "apg_iv",
      children: ["apiaceae", "araliaceae", "griseliniaceae", "myodocarpaceae", "pennantiaceae", "pittosporaceae", "torricelliaceae"]
    },
    {
      id: "apiaceae",
      name: "Apiaceae",
      rank: "family",
      source: "apg_iv",
      children: ["daucus", "coriandrum"]
    },
    {
      id: "daucus",
      name: "Daucus",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "coriandrum",
      name: "Coriandrum",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "araliaceae",
      name: "Araliaceae",
      rank: "family",
      source: "apg_iv",
      children: ["hedera", "panax"]
    },
    {
      id: "hedera",
      name: "Hedera",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "panax",
      name: "Panax",
      rank: "genus",
      source: "apg_iv"
    },
    {
      id: "griseliniaceae",
      name: "Griseliniaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "myodocarpaceae",
      name: "Myodocarpaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pennantiaceae",
      name: "Pennantiaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "pittosporaceae",
      name: "Pittosporaceae",
      rank: "family",
      source: "apg_iv"
    },
    {
      id: "torricelliaceae",
      name: "Torricelliaceae",
      rank: "family",
      source: "apg_iv"
    }
  ]
};
