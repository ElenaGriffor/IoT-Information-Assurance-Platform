#!/usr/bin/env python3
"""
Parse ventilator technical specification PDFs to extract security characteristics
and generate JSON output compatible with the IA framework
"""

import PyPDF2
import re
import json
import sys
from datetime import datetime

class VentilatorSpecParser:
    def __init__(self):
        # Define the 5 security characteristics we're looking for
        self.characteristics = {
            'Confidentiality': {
                'keywords': ['encryption', 'confidential', 'privacy', 'data protection', 
                            'access control', 'HIPAA', 'GDPR', 'secure', 'classified'],
                'requirements': [],
                'gaps': []
            },
            'Integrity': {
                'keywords': ['validation', 'integrity', 'checksum', 'signature', 'verification',
                            'calibration', 'accuracy', 'tamper', 'corruption'],
                'requirements': [],
                'gaps': []
            },
            'Availability': {
                'keywords': ['uptime', 'availability', 'redundancy', 'failover', 'backup',
                            'fault tolerance', 'reliability', 'emergency', 'continuous'],
                'requirements': [],
                'gaps': []
            },
            'Human/Trust': {
                'keywords': ['user interface', 'UI', 'training', 'alarm', 'trust', 'usability',
                            'intuitive', 'workflow', 'human factors', 'ergonomic'],
                'requirements': [],
                'gaps': []
            },
            'Authentication': {
                'keywords': ['authentication', 'login', 'password', 'biometric', 'multi-factor',
                            'authorization', 'identity', 'access', 'credential'],
                'requirements': [],
                'gaps': []
            }
        }
        
        # Information states mapping
        self.info_states = {
            'processing': ['process', 'compute', 'calculate', 'analyze', 'real-time'],
            'storage': ['store', 'save', 'record', 'log', 'database', 'memory'],
            'transmission': ['transmit', 'send', 'transfer', 'communicate', 'network']
        }
        
        # IA measure types
        self.measure_types = {
            'technology': ['implement', 'deploy', 'use', 'install', 'configure'],
            'policy': ['policy', 'procedure', 'guideline', 'standard', 'compliance'],
            'training': ['train', 'educate', 'learn', 'competency', 'certification']
        }

    def extract_text_from_pdf(self, pdf_path):
        """Extract text content from PDF file"""
        text = ""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text()
        except Exception as e:
            print(f"Error reading PDF: {e}")
            return None
        return text

    def extract_requirements(self, text, characteristic):
        """Extract requirements for a specific characteristic from text"""
        requirements = []
        gaps = []
        
        # Look for requirement patterns (REQ-XXX-NNN)
        req_pattern = r'REQ-[A-Z]+-\d{3}:\s*([^\n]+)'
        req_matches = re.findall(req_pattern, text)
        
        # Also look for bullet points with requirements
        bullet_pattern = r'[•▪]\s*([^•\n]+(?:requirement|must|shall|should)[^•\n]+)'
        bullet_matches = re.findall(bullet_pattern, text, re.IGNORECASE)
        
        # Look for gaps
        gap_pattern = r'GAP-\d{3}[^\n]*' + characteristic + r'[^\n]*([^\n]+)'
        gap_matches = re.findall(gap_pattern, text, re.IGNORECASE)
        
        # Check which requirements match this characteristic
        char_keywords = self.characteristics[characteristic]['keywords']
        
        for req in req_matches + bullet_matches:
            req_lower = req.lower()
            if any(keyword in req_lower for keyword in char_keywords):
                # Determine information state
                info_state = self._determine_info_state(req)
                # Determine measure type
                measure_type = self._determine_measure_type(req)
                
                requirements.append({
                    'requirement': req.strip(),
                    'characteristic': characteristic,
                    'info_state': info_state,
                    'measure_type': measure_type,
                    'source': 'technical_specification'
                })
        
        # Process gaps
        for gap in gap_matches:
            gaps.append({
                'gap': gap.strip(),
                'characteristic': characteristic,
                'identified': True
            })
        
        # Check if characteristic is underrepresented
        if len(requirements) < 2:
            gaps.append({
                'gap': f'Limited requirements found for {characteristic}',
                'characteristic': characteristic,
                'identified': False
            })
        
        return requirements, gaps

    def _determine_info_state(self, text):
        """Determine the information state from requirement text"""
        text_lower = text.lower()
        for state, keywords in self.info_states.items():
            if any(keyword in text_lower for keyword in keywords):
                return state
        return 'processing'  # default

    def _determine_measure_type(self, text):
        """Determine the IA measure type from requirement text"""
        text_lower = text.lower()
        for measure, keywords in self.measure_types.items():
            if any(keyword in text_lower for keyword in keywords):
                return measure
        return 'technology'  # default

    def parse_specification(self, pdf_path):
        """Main parsing function"""
        # Extract text from PDF
        text = self.extract_text_from_pdf(pdf_path)
        if not text:
            return None
        
        # Parse requirements for each characteristic
        results = {
            'metadata': {
                'document': pdf_path.split('/')[-1],
                'parsed_date': datetime.now().isoformat(),
                'parser_version': '1.0'
            },
            'characteristics': {},
            'summary': {
                'total_requirements': 0,
                'total_gaps': 0,
                'coverage': {}
            }
        }
        
        for characteristic in self.characteristics:
            requirements, gaps = self.extract_requirements(text, characteristic)
            
            results['characteristics'][characteristic] = {
                'requirements': requirements,
                'gaps': gaps,
                'count': len(requirements)
            }
            
            results['summary']['total_requirements'] += len(requirements)
            results['summary']['total_gaps'] += len(gaps)
            results['summary']['coverage'][characteristic] = 'Good' if len(requirements) >= 3 else 'Limited'
        
        return results

    def generate_spreadsheet_output(self, results):
        """Generate a spreadsheet-compatible output"""
        rows = []
        
        # Header row
        rows.append(['Characteristic', 'Requirement', 'Information State', 
                    'Measure Type', 'Gap Identified', 'Coverage'])
        
        # Data rows
        for char, data in results['characteristics'].items():
            coverage = results['summary']['coverage'][char]
            
            # Add requirements
            for req in data['requirements']:
                rows.append([
                    char,
                    req['requirement'],
                    req['info_state'],
                    req['measure_type'],
                    'No',
                    coverage
                ])
            
            # Add gaps
            for gap in data['gaps']:
                rows.append([
                    char,
                    '',
                    '',
                    '',
                    gap['gap'],
                    coverage
                ])
        
        return rows

    def convert_to_ia_json_schema(self, results):
        """Convert parsed results to IA framework JSON schema format"""
        ia_json = {}
        
        # Map characteristics to coordinates in the 5x4x3 array
        char_mapping = {
            'Confidentiality': 0,
            'Integrity': 1,
            'Availability': 2,
            'Human/Trust': 3,
            'Authentication': 4
        }
        
        state_mapping = {
            'processing': 0,
            'storage': 1,
            'transmission': 2,
            'all': 3  # for general requirements
        }
        
        measure_mapping = {
            'technology': 0,
            'policy': 1,
            'training': 2
        }
        
        # Generate coordinates and populate requirements
        for char, data in results['characteristics'].items():
            char_idx = char_mapping.get(char, 0)
            
            for req in data['requirements']:
                state_idx = state_mapping.get(req['info_state'], 0)
                measure_idx = measure_mapping.get(req['measure_type'], 0)
                
                # Create coordinate string
                coord = f"{char_idx},{state_idx},{measure_idx}"
                
                ia_json[coord] = {
                    "coordinate_id": coord,
                    "characteristic": char,
                    "info_state": req['info_state'],
                    "measure_type": req['measure_type'],
                    "description": f"{char} - {req['info_state']} - {req['measure_type']}",
                    "requirement": req['requirement'],
                    "source": "Synthetic_Ventilator_Model_1X_Spec.pdf",
                    "value": 1  # Indicates requirement exists
                }
        
        return ia_json

def main():
    if len(sys.argv) < 2:
        # Default to synthetic ventilator spec
        pdf_path = 'client/public/pdf/Synthetic_Ventilator_Model_1X_Spec.pdf'
    else:
        pdf_path = sys.argv[1]
    
    parser = VentilatorSpecParser()
    results = parser.parse_specification(pdf_path)
    
    if results:
        # Save parsed results
        with open('parsed_ventilator_spec.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        # Generate IA framework compatible JSON
        ia_json = parser.convert_to_ia_json_schema(results)
        with open('ventilator_ia_requirements.json', 'w') as f:
            json.dump(ia_json, f, indent=2)
        
        # Generate spreadsheet data
        spreadsheet_data = parser.generate_spreadsheet_output(results)
        
        # Save as CSV
        import csv
        with open('ventilator_security_analysis.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(spreadsheet_data)
        
        print("Parsing complete!")
        print(f"Total requirements found: {results['summary']['total_requirements']}")
        print(f"Total gaps identified: {results['summary']['total_gaps']}")
        print("\nCoverage by characteristic:")
        for char, coverage in results['summary']['coverage'].items():
            print(f"  {char}: {coverage}")
    else:
        print("Failed to parse PDF")

if __name__ == "__main__":
    main()