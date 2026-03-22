import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe: Convertir codes CIM-10 en libellés
 * CIM-10: Classification Internationale des Maladies (version 10)
 * Utilisation: {{ 'J44' | cim10 }} → "Bronchopneumopathie chronique obstructive"
 */
@Pipe({
  name: 'cim10',
  standalone: true
})
export class Cim10Pipe implements PipeTransform {
  // Base de données de codes CIM-10 (partielle pour la démo)
  private readonly codesCIM10: Record<string, string> = {
    // Respiratoire
    'J44': 'Bronchopneumopathie chronique obstructive',
    'J45': 'Asthme',
    'J06': 'Infection aiguë des voies respiratoires supérieures',
    'J15': 'Pneumonie bactérienne',
    'J18': 'Pneumonie, micro-organisme non spécifié',
    'J20': 'Bronchite aiguë',
    'J30': 'Allergies rhume des foins',

    // Cardiovasculaire
    'I10': 'Hypertension artérielle essentielle',
    'I50': 'Insuffisance cardiaque',
    'I21': 'Infarctus du myocarde',
    'I63': 'Accident vasculaire cérébral ischémique',
    'I64': 'Accident vasculaire cérébral, non spécifié',
    'I35': 'Affections des valves aortiques',

    // Endocrinien
    'E11': 'Diabète de type 2',
    'E10': 'Diabète de type 1',
    'E03': 'Hypothyroïdie',
    'E05': 'Thyréotoxicose',

    // Digestif
    'K25': 'Ulcère de l\'estomac',
    'K29': 'Gastrite',
    'K21': 'Reflux gastro-œsophagien',
    'K80': 'Lithiase biliaire',
    'K70': 'Maladie alcoolique du foie',

    // Mental
    'F32': 'Trouble dépressif majeur - Épisode actuel dépressif',
    'F33': 'Trouble dépressif majeur - Troubles récurrents',
    'F41': 'Troubles anxieux',
    'F20': 'Schizophrénie',
    'F06': 'Troubles mentaux dus à une affection somatique',

    // Neurologique
    'G30': 'Maladie d\'Alzheimer',
    'G20': 'Maladie de Parkinson',
    'G35': 'Sclérose en plaques',
    'G89': 'Douleur, non classée ailleurs',

    // Infectieux
    'B20': 'Infection par le VIH',
    'A15': 'Tuberculose respiratoire',
    'B95': 'Streptocoque, staphylocoque, pneumocoque',

    // Néoplasie
    'C34': 'Malignes de la bronche et du poumon',
    'C50': 'Malignes du sein',
    'C61': 'Malignes de la prostate',
    'C80': 'Malignité, site non spécifié',

    // Génito-urinaire
    'N18': 'Maladie chronique des reins',
    'N10': 'Néphrite tubulo-interstitielle aiguë',

    // Oculaire
    'H47': 'Neuropathie optique',
    'H35': 'Autres affections de la rétine',

    // Systémique
    'M06': 'Polyarthrite rhumatoïde',
    'M32': 'Lupus érythémateux disséminé',

    // Dermatologique
    'L89': 'Ulcus decubitus à chariot',
    'L20': 'Dermatite atopique',
  };

  transform(code: string): string {
    if (!code) return '';
    
    const libelle = this.codesCIM10[code];
    
    if (libelle) {
      return `${code}: ${libelle}`;
    }
    
    // Si code non trouvé, retourner le code tel quel
    return code;
  }

  /**
   * Obtenir la liste de codes disponibles
   */
  obtenirTousLesCodesCIM10(): Array<{ code: string; libelle: string }> {
    return Object.entries(this.codesCIM10).map(([code, libelle]) => ({
      code,
      libelle,
    }));
  }

  /**
   * Rechercher par libellé
   */
  rechercher(motCle: string): Array<{ code: string; libelle: string }> {
    const motCleLower = motCle.toLowerCase();
    return Object.entries(this.codesCIM10)
      .filter(([code, libelle]) =>
        code.toLowerCase().includes(motCleLower) ||
        libelle.toLowerCase().includes(motCleLower)
      )
      .map(([code, libelle]) => ({ code, libelle }));
  }
}
