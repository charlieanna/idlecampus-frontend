import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Notion - Collaborative Workspace
 * Comprehensive FR and NFR scenarios
 */
export const notionProblemDefinition: ProblemDefinition = {
  id: 'notion',
  title: 'Notion - Collaborative Workspace',
  description: `Design a collaborative workspace like Notion that:
- Users can create pages with rich content (text, images, databases)
- Multiple users can edit pages in real-time
- Pages can be organized hierarchically
- Users can share and collaborate on workspaces`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create pages with rich content (text, images, databases)',
    'Users can share and collaborate on workspaces'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process page edits and real-time sync',
      },
      {
        type: 'storage',
        reason: 'Need to store pages, blocks, users, workspaces',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time collaborative editing',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends edit requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store page data',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server syncs edits in real-time',
      },
    ],
    dataModel: {
      entities: ['user', 'workspace', 'page', 'block', 'permission'],
      fields: {
        user: ['id', 'email', 'name', 'created_at'],
        workspace: ['id', 'name', 'owner_id', 'created_at'],
        page: ['id', 'workspace_id', 'parent_page_id', 'title', 'created_at'],
        block: ['id', 'page_id', 'type', 'content', 'position', 'created_at'],
        permission: ['id', 'page_id', 'user_id', 'role', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Editing pages
        { type: 'read_by_key', frequency: 'very_high' }, // Loading pages
      ],
    },
  },

  scenarios: generateScenarios('notion', problemConfigs.notion),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],

  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
workspaces = {}
pages = {}
blocks = {}
permissions = {}

def create_page(page_id: str, workspace_id: str, title: str, parent_page_id: str = None) -> Dict:
    """
    FR-1: Users can create pages with rich content
    Naive implementation - stores page in memory
    """
    pages[page_id] = {
        'id': page_id,
        'workspace_id': workspace_id,
        'parent_page_id': parent_page_id,
        'title': title,
        'created_at': datetime.now()
    }
    return pages[page_id]

def add_text_block(block_id: str, page_id: str, content: str, position: int) -> Dict:
    """
    FR-1: Add text block to page
    Naive implementation - stores block in memory
    """
    blocks[block_id] = {
        'id': block_id,
        'page_id': page_id,
        'type': 'text',
        'content': content,
        'position': position,
        'created_at': datetime.now()
    }
    return blocks[block_id]

def add_image_block(block_id: str, page_id: str, image_url: str, position: int) -> Dict:
    """
    FR-1: Add image to page
    Naive implementation - stores image block reference
    """
    blocks[block_id] = {
        'id': block_id,
        'page_id': page_id,
        'type': 'image',
        'content': image_url,
        'position': position,
        'created_at': datetime.now()
    }
    return blocks[block_id]

def share_workspace(permission_id: str, workspace_id: str, user_id: str, role: str = "viewer") -> Dict:
    """
    FR-2: Users can share and collaborate on workspaces
    Naive implementation - grants user access to workspace
    """
    permissions[permission_id] = {
        'id': permission_id,
        'workspace_id': workspace_id,
        'user_id': user_id,
        'role': role,  # viewer, editor, admin
        'created_at': datetime.now()
    }
    return permissions[permission_id]

def get_page_content(page_id: str) -> Dict:
    """
    Helper: Get page with all its blocks
    Naive implementation - returns page and sorted blocks
    """
    if page_id not in pages:
        return None

    page = pages[page_id].copy()
    page_blocks = [b for b in blocks.values() if b['page_id'] == page_id]
    page_blocks.sort(key=lambda x: x['position'])
    page['blocks'] = page_blocks
    return page
`,
};
