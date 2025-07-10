import os
import hashlib
from pathlib import Path
import mimetypes


def get_file_size(file_path):
    """
    Get file size in bytes

    Args:
        file_path: Path to the file

    Returns:
        int: File size in bytes, or 0 if file doesn't exist
    """
    try:
        return os.path.getsize(file_path)
    except (FileNotFoundError, OSError):
        return 0


def get_file_hash(file_path, algorithm="md5", buffer_size=65536):
    """
    Calculate file hash

    Args:
        file_path: Path to the file
        algorithm: Hash algorithm to use ('md5', 'sha1', 'sha256')
        buffer_size: Buffer size for reading file chunks

    Returns:
        str: Hex digest of file hash, or None if file doesn't exist
    """
    if not os.path.exists(file_path):
        return None

    if algorithm == "md5":
        hash_obj = hashlib.md5()
    elif algorithm == "sha1":
        hash_obj = hashlib.sha1()
    elif algorithm == "sha256":
        hash_obj = hashlib.sha256()
    else:
        raise ValueError(f"Unsupported hash algorithm: {algorithm}")

    try:
        with open(file_path, "rb") as f:
            buffer = f.read(buffer_size)
            while buffer:
                hash_obj.update(buffer)
                buffer = f.read(buffer_size)

        return hash_obj.hexdigest()
    except (IOError, OSError):
        return None


def get_file_extension(file_path):
    """
    Get file extension without the dot

    Args:
        file_path: Path to the file

    Returns:
        str: File extension without the dot, or empty string if no extension
    """
    _, ext = os.path.splitext(file_path)
    if ext.startswith("."):
        ext = ext[1:]
    return ext.lower()


def get_mime_type(file_path):
    """
    Get file MIME type

    Args:
        file_path: Path to the file

    Returns:
        str: MIME type of the file, or 'application/octet-stream' if unknown
    """
    mime_type, _ = mimetypes.guess_type(file_path)
    return mime_type or "application/octet-stream"


def get_file_category(file_path):
    """
    Categorize file based on its extension or MIME type

    Args:
        file_path: Path to the file

    Returns:
        str: File category ('document', 'image', 'video', 'audio', 'code', 'data', 'archive', 'other')
    """
    ext = get_file_extension(file_path).lower()
    mime = get_mime_type(file_path)

    # Documents
    if ext in [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "txt",
        "rtf",
        "odt",
        "ods",
        "odp",
    ]:
        return "document"

    # Images
    if ext in ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "tiff", "ico"]:
        return "image"

    # Videos
    if ext in ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "mpeg", "m4v"]:
        return "video"

    # Audio
    if ext in ["mp3", "wav", "ogg", "flac", "aac", "m4a", "wma"]:
        return "audio"

    # Code files
    if ext in [
        "py",
        "js",
        "html",
        "css",
        "java",
        "c",
        "cpp",
        "cs",
        "php",
        "rb",
        "go",
        "ts",
        "jsx",
        "tsx",
    ]:
        return "code"

    # Data files
    if ext in ["json", "xml", "csv", "yaml", "yml", "sql", "db", "sqlite", "mdb"]:
        return "data"

    # Archives
    if ext in ["zip", "rar", "tar", "gz", "7z", "bz2", "xz"]:
        return "archive"

    # Check by MIME type
    if mime.startswith("image/"):
        return "image"
    if mime.startswith("video/"):
        return "video"
    if mime.startswith("audio/"):
        return "audio"
    if mime.startswith("text/"):
        return "document"

    # Default
    return "other"


def format_file_size(size_bytes):
    """
    Format file size in human-readable format

    Args:
        size_bytes: File size in bytes

    Returns:
        str: Formatted file size (e.g., "1.23 MB")
    """
    if size_bytes < 0:
        raise ValueError("File size cannot be negative")

    if size_bytes == 0:
        return "0 B"

    size_names = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    i = 0

    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024
        i += 1

    return f"{size_bytes:.2f} {size_names[i]}"


def is_file_valid(file_path):
    """
    Check if a file exists and is readable

    Args:
        file_path: Path to the file

    Returns:
        bool: True if file exists and is readable, False otherwise
    """
    return os.path.isfile(file_path) and os.access(file_path, os.R_OK)


def list_directory_files(dir_path, recursive=True, include_hidden=False):
    """
    List files in a directory

    Args:
        dir_path: Path to the directory
        recursive: Whether to include files in subdirectories
        include_hidden: Whether to include hidden files

    Returns:
        list: List of file paths
    """
    if not os.path.isdir(dir_path):
        return []

    file_list = []

    if recursive:
        for root, _, files in os.walk(dir_path):
            for file in files:
                if include_hidden or not file.startswith("."):
                    file_list.append(os.path.join(root, file))
    else:
        with os.scandir(dir_path) as entries:
            for entry in entries:
                if entry.is_file() and (
                    include_hidden or not entry.name.startswith(".")
                ):
                    file_list.append(entry.path)

    return file_list
