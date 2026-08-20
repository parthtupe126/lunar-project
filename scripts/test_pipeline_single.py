import sys
sys.path.append('scripts')
from lunar_etl_pipeline import process_node, LUNAR_NODES

if __name__ == '__main__':
    node = LUNAR_NODES[0]
    print(f"Testing for node: {node['name']}")
    res = process_node(node)
    print("Result:", res)
