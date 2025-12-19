#!/usr/bin/env python3

import graphviz

# Create a new directed graph
dot = graphviz.Digraph('InformationFlow', format='png')

# Graph settings
dot.attr(rankdir='BT', nodesep='0.8', ranksep='1.2', bgcolor='#f9f9f9', fontname='Arial')
dot.attr('node', shape='box', style='filled,rounded', fontname='Arial', fontsize='12')
dot.attr('edge', fontname='Arial', fontsize='10')

# Level 1: Technologies
with dot.subgraph(name='cluster_level1') as c:
    c.attr(label='Level 1: Technologies', labeljust='r', style='filled,rounded', 
           fillcolor='#e8f4fd', fontsize='14', fontcolor='#2c5282')
    
    # Sensors
    c.node('S1', 'S1\nBreathing\nFrequency', fillcolor='#4299e1', fontcolor='white', shape='cylinder')
    c.node('S2', 'S2\nEnd-expiratory\nPressure', fillcolor='#4299e1', fontcolor='white', shape='cylinder')
    c.node('S3', 'S3\nPhysician\nLogin', fillcolor='#4299e1', fontcolor='white', shape='cylinder')
    
    # Network
    c.node('Networks', 'Networks', fillcolor='#bee3f8', shape='box3d')

# Information Item Gateway
dot.node('IIG', 'Information Item Gateway (IIG)', fillcolor='#5a67d8', fontcolor='white', 
         shape='box3d', width='5.5', height='0.8', style='filled,bold')

# Level 2: Services
with dot.subgraph(name='cluster_level2') as c:
    c.attr(label='Level 2: Services', labeljust='r', style='filled,rounded', 
           fillcolor='#f0e6ff', fontsize='14', fontcolor='#553c9a')
    
    c.node('Service1', 'Mandatory/spontaneous\nBreath synchronization', fillcolor='#9f7aea')
    c.node('Service2', 'Measure pressure', fillcolor='#9f7aea')

# Services Gateway
dot.node('ServicesGateway', 'Services Gateway', fillcolor='#805ad5', fontcolor='white', 
         shape='box3d', width='5.5', height='0.8', style='filled,bold')

# Level 3: Application
with dot.subgraph(name='cluster_level3') as c:
    c.attr(label='Level 3: Application', labeljust='r', style='filled,rounded', 
           fillcolor='#fef5e7', fontsize='14', fontcolor='#c05621')
    
    c.node('PCSIMV', 'PC-SIMV', fillcolor='#ed8936', fontcolor='white')
    c.node('VentilatorUnit', 'Ventilator\nUnit', fillcolor='#f6ad55', shape='house')

# Connections from sensors to IIG
dot.edge('S1', 'IIG', label='Proprietary\nprotocol', color='#2d3748', penwidth='2')
dot.edge('S2', 'IIG', label='Proprietary\nprotocol', color='#2d3748', penwidth='2')
dot.edge('S3', 'IIG', label='Proprietary\nprotocol', color='#2d3748', penwidth='2')
dot.edge('Networks', 'IIG', style='dashed', color='#718096')

# Connections from IIG to Services
dot.edge('IIG', 'Service1', label='S1-S2', color='#5a67d8', penwidth='2')
dot.edge('IIG', 'Service2', label='S1-S2', color='#5a67d8', penwidth='2')

# Connections to Services Gateway
dot.edge('Service1', 'ServicesGateway', color='#9f7aea', penwidth='2')
dot.edge('Service2', 'ServicesGateway', color='#9f7aea', penwidth='2')

# Connections from Services Gateway to Application
dot.edge('ServicesGateway', 'PCSIMV', label='S1-S3', color='#805ad5', penwidth='2')

# Application level connections
dot.edge('PCSIMV', 'VentilatorUnit', label='Breathing assist\nmessage', color='#ed8936', penwidth='2', style='bold')
dot.edge('ServicesGateway', 'PCSIMV', label='Login authentication', color='#ed8936', penwidth='2', dir='back')

# Legend
with dot.subgraph(name='cluster_legend') as c:
    c.attr(label='Information Flow', labeljust='l', style='filled,rounded', 
           fillcolor='#ffffff', fontsize='12')
    
    legend_html = '''<
        <TABLE BORDER="0" CELLBORDER="0" CELLSPACING="5">
            <TR><TD ALIGN="LEFT"><B>S1:</B> Breathing frequency sensor</TD></TR>
            <TR><TD ALIGN="LEFT"><B>S2:</B> End-expiratory pressure sensor</TD></TR>
            <TR><TD ALIGN="LEFT"><B>S3:</B> Physician login sensor</TD></TR>
            <TR><TD ALIGN="LEFT"><B>IIG:</B> Information Item Gateway</TD></TR>
            <TR><TD ALIGN="LEFT"><B>PC-SIMV:</B> Pressure Control-Synchronized Intermittent Mandatory Ventilation</TD></TR>
        </TABLE>
    >'''
    c.node('legend', legend_html, shape='plaintext', fillcolor='transparent')

# Render the graph
try:
    dot.render('information_flow_improved', format='png', cleanup=True)
    print("Diagram generated successfully: information_flow_improved.png")
except Exception as e:
    print(f"Error generating diagram: {e}")
    print("\nTrying to save as DOT file instead...")
    dot.save('information_flow_improved.dot')
    print("DOT file saved: information_flow_improved.dot")