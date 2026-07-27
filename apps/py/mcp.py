from mcp.server import FastMCP # 导入 FastMCP 库（MCP 的快速开发工具）
mcp = FastMCP("Demo")# 这个Demo就是MCP Server的名字
@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a+b

if __name__ == "__main__":
    # Initialize and run the server
    mcp.run(transport='stdio')