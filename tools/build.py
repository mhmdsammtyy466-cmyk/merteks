#!/usr/bin/env python3
"""Build: src/*  ->  css/ , js/   (run:  python3 tools/build.py)"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'src')); sys.path.insert(0, os.path.join(ROOT, 'tools'))
from min import minify
import cssprune as cp

def build_css():
    css = ''
    for part in ('src/style.css', 'src/perf.css'):
        css += '\n' + open(os.path.join(ROOT, part), encoding='utf-8').read()
    css = cp.strip_comments(css)
    items = cp.parse(css)
    out = cp.emit(items, False)
    open(os.path.join(ROOT, 'css/style.css'), 'w', encoding='utf-8').write(out)
    print('css/style.css', len(out.encode()))

def build_js():
    for name, dest in (('app', 'app'), ('assistant', 'assistant'), ('admin', 'admin')):
        src = open(os.path.join(ROOT, f'src/{name}.src.js'), encoding='utf-8').read()
        out = minify(src)
        open(os.path.join(ROOT, f'js/{dest}.js'), 'w', encoding='utf-8').write(out)
        print(f'js/{dest}.js', len(out.encode()))

if __name__ == '__main__':
    build_css(); build_js()
